import express, { Express } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import Fuse from 'fuse.js';
import morgan from 'morgan';
// import passport from 'passport';
// import PassportJwt from 'passport-jwt';
import User from '../models/User';
import { IUserDocument } from '../types/user.type';
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
import db from '../dbConfigs';
// import authenticate from './auth';

import ReviewsCollection from '../models/Reviews';
import LandlordsCollection from '../models/Landlords';
import ApartmentsCollection from '../models/Buildings';
// doc._id can't pass yarn workspace linter tests
const app: Express = express();

dotenv.config();

app.use(express.json());
app.use(cors({ origin: '*' }));
app.use(morgan('combined'));
app.use(express.static(__dirname)); //here is important thing - no static directory, because all static :)

// app.use(passport.initialize());
// const { Strategy: JwtStrategy, ExtractJwt } = PassportJwt;
// const opts = {
//   jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
//   secretOrKey: process.env.AUTH_SECRET,
// };
// passport.use(
//   new JwtStrategy(opts, (jwtPayload, done) => {
//     User.findById(jwtPayload._id, (err: any, user: IUserDocument) => {
//       if (err) {
//         return done(err, false);
//       }
//       if (user) {
//         return done(null, user);
//       }
//       return done(null, false);
//     });
//   })
// );

db.dbConnection();
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
  if (reviewDocs === undefined) {
    res.status(200).send([]);
  } else {
    // const reviews = await ReviewsCollection.where(`idType`).equals(id).exec()
    // const reviews: Review[] = reviewDocs.map((doc) => {
    //   const review = { ...doc, date: doc.date } as ReviewInternal;
    //   return { ...review, id: doc.id } as ReviewWithId;
    // });
    // res.status(200).send(JSON.stringify(reviews));
    res.status(200).send(reviewDocs);
  }
});

app.get('/apts/:ids', async (req, res) => {
  try {
    const { ids } = req.params;
    const idsList = ids.split(',');
    const aptsArr = await Promise.all(
      idsList.map(async (id) => {
        // const snapshot = await ApartmentsCollection.findById(id).exec();
        // const snapshot = await ApartmentsCollection.findOne({ id: id }).exec();
        const snapshot = await ApartmentsCollection.where('id').equals(Number(id)).exec();
        if (snapshot == null) {
          throw new Error('Invalid id');
        }
        // return { id, ...snapshot } as ApartmentWithId;
        // return snapshot as ApartmentWithId;
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
    // const buildings = buildingRefs.map((doc) => doc as Apartment);
    res.status(201).send(buildingRefs);
  } catch (err) {
    res.status(400).send(err);
  }
});

const pageData = async (buildings: ApartmentWithId[]) =>
  // console.log({ aptId: buildings[0].id });
  Promise.all(
    buildings.map(async (buildingData) => {
      // const { id, landlordId } = buildingData;
      // if (landlordId === null) {
      //   throw new Error('Invalid landlordId');
      // }
      if (buildingData.landlordId === null) {
        throw new Error('Invalid landlordId');
      }

      // const reviewList = await ReviewsCollection.where('aptId').equals(buildingData.id).exec();
      // const reviewList = await ReviewsCollection.where(`aptId`).equals(id).exec();
      // const landlordDoc = await LandlordsCollection.findById(landlordId).exec();
      const company = await LandlordsCollection.where('id')
        .equals(Number(buildingData.landlordId))
        .select('name')
        .exec();

      const numReviews = await ReviewsCollection.where('aptId')
        .equals(String(buildingData.id))
        .count()
        .exec();

      return {
        buildingData,
        numReviews,
        company,
      };
    })
  );

app.get('/buildings/all/:landlordId', async (req, res) => {
  const { landlordId } = req.params;
  // const buildingDocs = await ApartmentsCollection.where('landlordId').equals(landlordId).exec();
  // const buildings: ApartmentWithId[] = buildingDocs.map(
  //   (doc) => ({ id: doc.id, ...doc } as ApartmentWithId)
  // );
  //   const buildings: ApartmentWithId[] = buildingDocs.map(
  //   (doc) => ({ _id: doc._id as string, ...doc } as ApartmentWithId)
  // );
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
    // const landlordDocs = await LandlordsCollection.find().exec();
    // const landlords: LandlordWithId[] = landlordDocs.map(
    //   (landlord) => ({ _id: landlord._id, ...landlord } as LandlordWithId)
    // );
    // const aptDocs = await ApartmentsCollection.find().exec();
    // const apts: ApartmentWithId[] = aptDocs.map(
    //   // (apt) => ({ id: apt.id, ...apt } as ApartmentWithId)
    //   (apt) => ({ _id: apt._id, ...apt } as ApartmentWithId)
    // );
    const landlords = await LandlordsCollection.find();
    const apts = await ApartmentsCollection.find();
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
  // const collection =
  const collection =
    page === 'home'
      ? await ApartmentsCollection.find({}).limit(3)
      : await ApartmentsCollection.find({}).limit(12);
  // const buildingDocs = collection as Apartment[];
  // const buildings: ApartmentWithId[] = collection.map(
  //   (doc) => ({ _id: doc._id, ...doc } as ApartmentWithId)
  // );

  // console.log('collection');
  // console.log(buildings);
  // res.status(200).send(pageData(buildings));
  // res.status(200).send(buildings);
  console.log(collection[0].id);
  // buildings.map(async (buildingData) => {
  //   // const { id, landlordId } = buildingData;
  //   // if (landlordId === null) {
  //   //   throw new Error('Invalid landlordId');
  //   // }
  //   if (buildingData.landlordId === null) {
  //     throw new Error('Invalid landlordId');
  //   }

  //   const reviewList = await ReviewsCollection.where('aptId').equals(buildingData.id).exec();
  //   console.log("");
  //   // const reviewList = await ReviewsCollection.where(`aptId`).equals(id).exec();
  //   // const landlordDoc = await LandlordsCollection.findById(landlordId).exec();
  //   const company = await LandlordsCollection.where('id')
  //     .equals(buildingData.landlordId)
  //     .select('name')
  //     .exec();

  //   const numReviews = reviewList.length;

  // return {
  // buildingData,
  // numReviews,
  // company,
  // };
  res.status(200).send(await pageData(collection));
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
