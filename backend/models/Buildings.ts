import { model, Schema } from 'mongoose';
import autopopulate from 'mongoose-autopopulate';
import { IApartmentDocument } from '../types/apartment.type';

const apartmentSchema = new Schema(
  {
    id: {
      type: Number,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    landlordId: {
      type: Number,
    },
    numBaths: {
      type: Number,
    },
    numBeds: {
      type: Number,
    },
    photos: {
      type: [String],
    },
    area: {
      type: String,
    },
  },
  { timestamps: true, toObject: { virtuals: true }, toJSON: { virtuals: true } }
);

apartmentSchema.plugin(autopopulate);

export default model<IApartmentDocument>('ApartmentsCollection', apartmentSchema);
