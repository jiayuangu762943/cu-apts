import { IDocument } from './index.type';

export interface ILandlordDocument extends Document {
  readonly id: number;
  readonly name: string;
  readonly avgRating: number;
  readonly photos: readonly string[]; // can be empty
  readonly reviews: readonly string[]; // array of Review IDs in reviews collection
  readonly properties: readonly string[]; // array of Apartment IDs in apartments collection
  readonly address?: string;
  readonly profilePhoto?: string;
  readonly contact?: string;
}
