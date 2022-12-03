import { Document } from 'mongoose';
import { DetailedRating } from '../../frontend/common/types/db-types';

export interface IReviewDocument extends Document {
  readonly id: number;
  readonly aptId: string | null;
  readonly likes?: number;
  readonly date: Date;
  readonly detailedRatings: DetailedRating;
  readonly landlordId: string;
  readonly overallRating: number;
  readonly photos: readonly string[];
  readonly reviewText: string;
}
