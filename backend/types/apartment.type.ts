import mongoose, { Document } from 'mongoose';

export interface IApartmentDocument extends Document {
  // readonly _id: mongoose.Types.ObjectId;
  readonly id: number;
  readonly name: string;
  readonly address: string; // may change to placeID for Google Maps integration
  readonly landlordId: Number | null;
  readonly numBaths: number | null;
  readonly numBeds: number | null;
  readonly photos: readonly string[]; // can be empty
  readonly area: 'COLLEGETOWN' | 'WEST' | 'NORTH' | 'DOWNTOWN' | 'OTHER';
}
