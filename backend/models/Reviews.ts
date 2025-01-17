import { model, Schema } from 'mongoose';
import autopopulate from 'mongoose-autopopulate';
import { IReviewDocument } from '../types/review.type';

const reviewSchema = new Schema(
  {
    id: {
      type: Number,
      required: true,
    },
    aptId: {
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
        condition: { type: Number },
      },
      required: true,
    },
    landlordId: {
      type: String,
      required: true,
    },
    overallRating: {
      type: Number,
    },
    photos: {
      type: [String],
    },
    reviewText: {
      type: String,
      required: true,
    },
  },
  { timestamps: true, toObject: { virtuals: true }, toJSON: { virtuals: true } }
);

reviewSchema.plugin(autopopulate);

export default model<IReviewDocument>('ReviewsCollection', reviewSchema);
