import { IDocument } from './index.type';
// import { DetailedRating } from '../../../common/types/db-types';
export type DetailedRating = {
  readonly location: number;
  readonly safety: number;
  readonly value: number;
  readonly maintenance: number;
  readonly communication: number;
  readonly condition: number;
};

export interface IReviewDocument extends IDocument {
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
