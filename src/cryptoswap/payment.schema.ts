import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import mongoose from 'mongoose';

export type PaymentDocument = HydratedDocument<Payment>;

@Schema()
export class Payment {
  _id: mongoose.Types.ObjectId;

  @Prop({ required: true })
  completed: boolean;
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);
