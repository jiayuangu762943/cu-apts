import { model, Schema } from 'mongoose';
import autopopulate from 'mongoose-autopopulate';
import { IReviewDocument } from '../types/review.type';
// import { DetailedRating } from '../../common/types/db-types'

// type DetailedRating = {
//   readonly location: number;
//   readonly safety: number;
//   readonly value: number;
//   readonly maintenance: number;
//   readonly communication: number;
//   readonly conditions: number;
// };

const reviewSchema = new Schema(
  {
    id: {
      type: Number,
      required: true,
    },
    aptID: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    detailedRatings: {
      // type: DetailedRating,
      type: {
        location: { type: Number },
        safety: { type: Number },
        value: { type: Number },
        maintenance: { type: Number },
        communication: { type: Number },
        conditions: { type: Number },
      },
      required: true,
    },
    landlordId: {
      type: String,
      required: true,
    },
    overallRating: {
      type: [Number],
    },
    photos: {
      type: [String],
    },
    reviewText: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

reviewSchema.plugin(autopopulate);

export default model<IReviewDocument>('ReviewCollection', reviewSchema);
