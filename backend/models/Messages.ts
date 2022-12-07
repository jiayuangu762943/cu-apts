import { model, Schema } from 'mongoose';
import autopopulate from 'mongoose-autopopulate';
import { IMessageDocument } from '../types/message.type';

const messageSchema = new Schema(
  {
    // id: {
    //   type: Number,
    //   required: true,
    // },
    sender: {
      type: String,
      required: true,
    },
    receiver: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      // required: true,
    },
  },
  { timestamps: true, toObject: { virtuals: true }, toJSON: { virtuals: true } }
);

messageSchema.plugin(autopopulate);

export default model<IMessageDocument>('MessagesCollection', messageSchema);
