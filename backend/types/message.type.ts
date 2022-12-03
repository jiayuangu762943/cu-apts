import { Document } from 'mongoose';

export interface IMessageDocument extends Document {
  //   readonly id: number;
  readonly sender: string;
  readonly receiver: string;
  //   readonly date: Date;
  readonly content: string;
  readonly createdAt: Date;
}
