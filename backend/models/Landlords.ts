import { model, Schema } from 'mongoose';
import autopopulate from 'mongoose-autopopulate';
import { ILandlordDocument } from '../types/landlord.type';

const landlordSchema = new Schema(
  {
    id: {
      type: Number,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    contact: {
      type: String,
      required: true,
    },
    avgRating: {
      type: Number,
    },
    photos: {
      type: String,
    },
    reviews: {
      type: String,
    },
    properties: {
      type: String,
    },
    address: {
      type: Schema.Types.Mixed,
    },
  },
  { timestamps: true }
);

landlordSchema.plugin(autopopulate);

export default model<ILandlordDocument>('LandlordsCollection', landlordSchema);
