import express, { Express } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import Fuse from 'fuse.js';
import morgan from 'morgan';
import User from '../models/User';
import authenticate from './auth';
import {
  Review,
  Landlord,
  ReviewWithId,
  ReviewInternal,
  Apartment,
  LandlordWithId,
  LandlordWithLabel,
  ApartmentWithLabel,
  ApartmentWithId,
} from '../common/types/db-types';
import path from 'path';
import db from '../dbConfigs';

import ReviewsCollection from '../models/Reviews';
import LandlordsCollection from '../models/Landlords';
import ApartmentsCollection from '../models/Buildings';
import event from 'events';
const http = require('http');
const socketIO = require('socket.io');

const app: Express = express();

dotenv.config();
app.use(express.json());
// app.use(express.urlencoded())
app.use(cors({ origin: '*' }));
app.use(morgan('combined'));
app.use(express.static(__dirname)); //here is important thing - no static directory, because all static :)

db.dbConnection();

const { Kafka, logLevel } = require('kafkajs');
const ip = require('ip');
const host = process.env.HOST_IP || ip.address();

const kafka = new Kafka({
  logLevel: logLevel.DEBUG,
  brokers: [`${host}:9092`],
  clientId: 'example-producer',
});
const kafka_consumer = new Kafka({
  logLevel: logLevel.INFO,
  brokers: [`${host}:9092`],
  clientId: 'example-consumer',
});

app.post('/send', async (req, res) => {
  const producer = kafka.producer();
  const msg = 'Hello KafkaJS user!';
  await producer.connect();
  await producer.send({
    topic: 'topic-test',
    messages: [{ value: req.body.message }],
  });
  await producer.disconnect();

  res.status(201).send(
    JSON.stringify({
      messages: req.body.message,
    })
  );
});
let msgs: string[] = [];

app.get('/getMsgs', async (req, res) => {
  const consumer = kafka_consumer.consumer({ groupId: 'test-group' });
  await consumer.connect();
  await consumer.subscribe({ topic: 'topic-test', fromBeginning: true });
  await consumer.run({
    eachMessage: async ({ topic, partition, message }: any) => {
      const prefix = `${topic}[${partition} | ${message.offset}] / ${message.timestamp}`;
      console.log(`- ${prefix} ${message.key}#${message.value}`);
      msgs.push(message.value.toString());
    },
  });

  res.status(201).send(
    JSON.stringify({
      messages: msgs,
    })
  );
});

app.post('/new-review', authenticate, async (req, res) => {
  try {
    const review = req.body as Review;
    if (review.overallRating === 0 || review.reviewText === '') {
      res.status(401).send('Error: missing fields');
    }
    const new_id = (await ReviewsCollection.count().exec()) + 1;
    const newReviewDoc = new ReviewsCollection({
      ...review,
      id: new_id,
      date: new Date(review.date),
      likes: 0,
    });
    const newReview = await newReviewDoc.save();
    console.log(newReview);
    res.sendStatus(201).send(newReviewDoc.id);
  } catch (err) {
    console.error(err);
    res.status(401).send('Error');
  }
});

app.get('/review/:idType/:id', async (req, res) => {
  const { idType, id } = req.params;
  const reviewDocs = await ReviewsCollection.where(idType).equals(id).exec();
  if (reviewDocs === undefined) {
    res.status(200).send([]);
  } else {
    res.status(200).send(reviewDocs);
  }
});

app.get('/apts/:ids', async (req, res) => {
  try {
    const { ids } = req.params;
    const idsList = ids.split(',');
    const aptsArr = await Promise.all(
      idsList.map(async (id) => {
        const snapshot = await ApartmentsCollection.where('id').equals(Number(id)).exec();
        if (snapshot == null) {
          throw new Error('Invalid id');
        }
        return snapshot[0];
      })
    );
    res.status(200).send(JSON.stringify(aptsArr));
  } catch (err) {
    res.status(400).send(err);
  }
});

app.get('/landlord/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const doc = await LandlordsCollection.findOne({ id: id }).exec();
    if (doc == null) {
      throw new Error('Invalid id');
    }
    // const data = doc as Landlord;
    const data = doc as LandlordWithId;
    res.status(201).send(data);
  } catch (err) {
    res.status(400).send(err);
  }
});

app.get('/buildings/:landlordId', async (req, res) => {
  try {
    const { landlordId } = req.params;
    const buildingRefs = await ApartmentsCollection.where('landlordId').equals(landlordId).exec();
    res.status(201).send(buildingRefs);
  } catch (err) {
    res.status(400).send(err);
  }
});

const pageData = async (buildings: ApartmentWithId[]) =>
  Promise.all(
    buildings.map(async (buildingData) => {
      if (buildingData.landlordId === null) {
        throw new Error('Invalid landlordId');
      }

      const company = await LandlordsCollection.find()
        .where('id')
        .equals(Number(buildingData.landlordId))
        .select('name')
        .exec();

      const numReviews = await ReviewsCollection.countDocuments({
        aptId: buildingData.id.toString(),
      }).exec();

      return {
        buildingData,
        numReviews,
        company,
      };
    })
  );

app.get('/buildings/all/:landlordId', async (req, res) => {
  const { landlordId } = req.params;
  const buildings = await ApartmentsCollection.find({ landlordId: landlordId }).exec();
  res.status(200).send(JSON.stringify(await pageData(buildings)));
});

app.post('/new-landlord', async (req, res) => {
  try {
    const landlord: Landlord = req.body as Landlord;
    const doc = new LandlordsCollection(landlord);
    res.status(201).send(doc.id);
  } catch (err) {
    console.error(err);
    res.status(400).send('Error');
  }
});

const isLandlord = (obj: LandlordWithId | ApartmentWithId): boolean => 'contact' in obj;
app.post('/set-data', async (req, res) => {
  try {
    const landlords = await LandlordsCollection.find({}).exec();
    const apts = await ApartmentsCollection.find({}).exec();
    app.set('landlords', landlords);
    app.set('apts', apts);

    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(400).send('Error');
  }
});
app.get('/search', async (req, res) => {
  try {
    const query = req.query.q as string;
    const apts = await ApartmentsCollection.find({}).lean().exec();

    const options = {
      keys: ['name', 'address'],
    };
    const fuse = new Fuse(apts, options);
    const results = fuse.search(query).slice(0, 5);
    const resultItems = results.map((result) => result.item);

    const resultsWithType: (LandlordWithLabel | ApartmentWithLabel)[] = resultItems.map(
      (result) => ({ label: 'APARTMENT', ...result } as ApartmentWithLabel)
    );
    res.status(200).send(JSON.stringify(resultsWithType));
  } catch (err) {
    console.error(err);
    res.status(400).send('Error');
  }
});

app.get('/search-results', async (req, res) => {
  try {
    const query = req.query.q as string;
    const apts = req.app.get('apts');
    const aptsWithType: ApartmentWithId[] = apts;

    const options = {
      keys: ['name', 'address'],
    };

    const fuse = new Fuse(aptsWithType, options);
    const results = fuse.search(query);
    const resultItems = results.map((result) => result.item);

    res.status(200).send(JSON.stringify(await pageData(resultItems)));
  } catch (err) {
    console.error(err);
    res.status(400).send('Error');
  }
});

app.get('/page-data/:page', async (req, res) => {
  const { page } = req.params;
  // const collection =
  const collection =
    page === 'home'
      ? await ApartmentsCollection.find({}).limit(3)
      : await ApartmentsCollection.find({}).limit(12);

  res.status(200).send(await pageData(collection));
});

app.post('/user', async (req, res) => {
  try {
    const doc = await new User(req.body).save();
    res.send(doc);
  } catch (e) {
    res.status(500).send(e);
  }
});

app.get('/user/current', async (req, res) => {
  try {
    res.send(req.user);
  } catch (e) {
    res.status(500).send(e);
  }
});

app.get('/user/:id', async (req, res) => {
  try {
    const doc = await User.findById(req.params.id);
    res.send(doc);
  } catch (e) {
    res.status(500).send(e);
  }
});

app.put('/user/:id', async (req, res) => {
  try {
    const note = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.send(note);
  } catch (e) {
    res.status(500).send(e);
  }
});

app.delete('/user/:id', async (req, res) => {
  try {
    const result = await User.findByIdAndDelete(req.params.id);
    res.send(result);
  } catch (e) {
    res.status(500).send(e);
  }
});

// const likeHandler =
//   (dislike = false): RequestHandler =>
//   async (req, res) => {
//     try {
//       if (!req.user) throw new Error('not authenticated');
//       const { uid } = req.user;
//       const { reviewId } = req.body;
//       if (!reviewId) throw new Error('must specify review id');
//       const likesRef = likesCollection.doc(uid);
//       const reviewRef = reviewCollection.doc(reviewId);
//       await db.runTransaction(async (t) => {
//         const likesDoc = await t.get(likesRef);
//         const result = likesDoc.get(reviewId);
//         if (dislike ? result : !result) {
//           const likeEntry = dislike ? FieldValue.delete() : true;
//           const likeChange = dislike ? -1 : 1;
//           t.set(likesRef, { [reviewId]: likeEntry }, { merge: true });
//           t.update(reviewRef, { likes: FieldValue.increment(likeChange) });
//         }
//       });
//       res.status(200).send(JSON.stringify({ result: 'Success' }));
//     } catch (err) {
//       console.error(err);
//       res.status(400).send('Error');
//     }
//   };

// app.post('/add-like', authenticate, likeHandler(false));

// app.post('/remove-like', authenticate, likeHandler(true));

export default app;
