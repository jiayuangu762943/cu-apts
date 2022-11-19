// import { Document } from 'mongoose';
import { IReviewDocument } from '../../frontend/src/types/review.type';
import { ILandlordDocument } from '../../frontend/src/types/landlord.type';
import { IApartmentDocument } from '../../frontend/src/types/apartment.type';

type Id = {
  // readonly _id: string;
  readonly _id: any;
};

type label = {
  readonly label: string;
};

type StringSet = Record<string, boolean>;

export type DetailedRating = {
  readonly location: number;
  readonly safety: number;
  readonly value: number;
  readonly maintenance: number;
  readonly communication: number;
  readonly condition: number;
};

export type Review = {
  readonly aptId: string | null;
  readonly likes?: number;
  readonly date: Date;
  readonly detailedRatings: DetailedRating;
  readonly landlordId: string;
  readonly overallRating: number;
  readonly photos: readonly string[];
  readonly reviewText: string;
};
//
// export type Review = IReviewDocument;

// export type ReviewWithId = Review & Id;
// export type ReviewWithId = IReviewDocument & Id;
export type ReviewWithId = IReviewDocument & Id;

// export type ReviewInternal = Review & {};
export type ReviewInternal = IReviewDocument & {};

// export type Landlord = {
//   readonly name: string;
//   readonly contact: string | null;
//   readonly avgRating: number;
//   readonly profilePhoto?: string;
//   readonly photos: readonly string[]; // can be empty
//   readonly reviews: readonly string[]; // array of Review IDs in reviews collection
//   readonly properties: readonly string[]; // array of Apartment IDs in apartments collection
//   readonly address: string | null;
// };
export type Landlord = ILandlordDocument;
// export type LandlordWithId = Landlord & Id;
export type LandlordWithId = ILandlordDocument & Id;
export type LandlordWithLabel = LandlordWithId & { readonly label: 'LANDLORD' };

export type Apartment = {
  readonly name: string;
  readonly address: string; // may change to placeID for Google Maps integration
  readonly landlordId: string | null;
  readonly numBaths: number | null;
  readonly numBeds: number | null;
  readonly photos: readonly string[]; // can be empty
  readonly area: 'COLLEGETOWN' | 'WEST' | 'NORTH' | 'DOWNTOWN' | 'OTHER';
};

// export type ApartmentWithId = Apartment & Id;
export type ApartmentWithId = IApartmentDocument & Id;

// export type ApartmentWithLabel = ApartmentWithId & { readonly label: 'APARTMENT' };

export type ApartmentWithLabel = ApartmentWithId & label;
export type LandlordOrApartmentWithLabel = LandlordWithLabel | ApartmentWithLabel;

export type Likes = StringSet;
