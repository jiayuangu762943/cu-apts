import express, { Express } from 'express';
import cors from 'cors';
import Fuse from 'fuse.js';
import morgan from 'morgan';
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
} from '@common/types/db-types';
import path from 'path';
import authenticate from './auth';

import ReviewsCollection from '../models/Reviews';
import LandlordsCollection from '../models/Landlords';
import ApartmentsCollection from '../models/Buildings';
// doc._id can't pass yarn workspace linter tests
const app: Express = express();

app.use(express.json());
app.use(cors({ origin: '*' }));
app.use(morgan('combined'));
app.use(express.static(__dirname)); //here is important thing - no static directory, because all static :)
app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname, 'index.html'));
});
// import db  '../dbConfigs';
// import { Section }  './firebase-config/types';

app.post('/new-review', async (req, res) => {
  try {
    const review = req.body as Review;
    if (review.overallRating === 0 || review.reviewText === '') {
      res.status(401).send('Error: missing fields');
    }
    const newReviewDoc = new ReviewsCollection({
      ...review,
      date: new Date(review.date),
      likes: 0,
    });

    await newReviewDoc.save();
    res.status(201).send(newReviewDoc.id);
  } catch (err) {
    console.error(err);
    res.status(401).send('Error');
  }
});

app.get('/review/:idType/:id', async (req, res) => {
  const { idType, id } = req.params;

  const reviewDocs = await ReviewsCollection.where(idType).equals(id).exec();
  const reviews: Review[] = reviewDocs.map((doc) => {
    const review = { ...doc, date: doc.date } as ReviewInternal;
    return { ...review, id: doc.id } as ReviewWithId;
  });
  res.status(200).send(JSON.stringify(reviews));
});

app.get('/apts/:ids', async (req, res) => {
  try {
    const { ids } = req.params;
    const idsList = ids.split(',');
    const aptsArr = await Promise.all(
      idsList.map(async (id) => {
        const snapshot = await ApartmentsCollection.findById(id).exec();
        if (snapshot == null) {
          throw new Error('Invalid id');
        }
        return { id, ...snapshot } as ApartmentWithId;
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

    const doc = await LandlordsCollection.findById(id).exec();
    if (doc == null) {
      throw new Error('Invalid id');
    }
    const data = doc as Landlord;
    res.status(201).send(data);
  } catch (err) {
    res.status(400).send(err);
  }
});

app.get('/buildings/:landlordId', async (req, res) => {
  try {
    const { landlordId } = req.params;
    const buildingRefs = await ApartmentsCollection.where('landlordId').equals(landlordId).exec();
    const buildings = buildingRefs.map((doc) => doc as Apartment);
    res.status(201).send(buildings);
  } catch (err) {
    res.status(400).send(err);
  }
});

const pageData = async (buildings: ApartmentWithId[]) =>
  Promise.all(
    buildings.map(async (buildingData) => {
      const { id, landlordId } = buildingData;
      if (landlordId === null) {
        throw new Error('Invalid landlordId');
      }

      const reviewList = await ReviewsCollection.where(`aptId`).equals(id).exec();
      const landlordDoc = await LandlordsCollection.findById(landlordId).exec();

      const numReviews = reviewList.length;
      const company = landlordDoc?.name;
      return {
        buildingData,
        numReviews,
        company,
      };
    })
  );

app.get('/buildings/all/:landlordId', async (req, res) => {
  const { landlordId } = req.params;
  const buildingDocs = await ApartmentsCollection.where('landlordId').equals(landlordId).exec();
  const buildings: ApartmentWithId[] = buildingDocs.map(
    (doc) => ({ id: doc.id, ...doc } as ApartmentWithId)
  );
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
    const landlordDocs = await LandlordsCollection.find().exec();
    const landlords: LandlordWithId[] = landlordDocs.map(
      (landlord) => ({ id: landlord.id, ...landlord } as LandlordWithId)
    );
    const aptDocs = await ApartmentsCollection.find().exec();
    const apts: ApartmentWithId[] = aptDocs.map(
      (apt) => ({ id: apt.id, ...apt } as ApartmentWithId)
    );
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
    const landlords = req.app.get('landlords');
    const apts = req.app.get('apts');
    const aptsLandlords: (LandlordWithId | ApartmentWithId)[] = [...landlords, ...apts];

    const options = {
      keys: ['name', 'address'],
    };
    const fuse = new Fuse(aptsLandlords, options);
    const results = fuse.search(query).slice(0, 5);
    const resultItems = results.map((result) => result.item);

    const resultsWithType: (LandlordWithLabel | ApartmentWithLabel)[] = resultItems.map((result) =>
      isLandlord(result)
        ? ({ label: 'LANDLORD', ...result } as LandlordWithLabel)
        : ({ label: 'APARTMENT', ...result } as ApartmentWithLabel)
    );
    res.status(200).send(JSON.stringify(resultsWithType));
  } catch (err) {
    console.error(err);
    res.status(400).send('Error');
  }
});

app.get('/page-data/:page', async (req, res) => {
  const { page } = req.params;
  const collection =
    page === 'home'
      ? await ApartmentsCollection.find().limit(3).exec()
      : await ApartmentsCollection.find().limit(12).exec();
  // const buildingDocs = collection as Apartment[];
  const buildings: ApartmentWithId[] = collection.map(
    (doc) => ({ id: doc.id, ...doc } as ApartmentWithId)
  );
  res.status(200).send(JSON.stringify(await pageData(buildings)));
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
