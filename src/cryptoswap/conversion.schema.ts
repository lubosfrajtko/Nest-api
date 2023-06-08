import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import mongoose from 'mongoose';

export type ConversionDocument = HydratedDocument<Conversion>;

// txn_id
// address
// currencyFrom
// currencyFromAmount
// currencyTo
// currencyToAmount
// paymentStatus - waiting, completed
// convertStatus - inactive, waiting, send, completed, cancelled

@Schema()
export class Conversion {
  _id: mongoose.Types.ObjectId;

  @Prop({ required: true })
  txn_id: string;

  @Prop()
  conversion_id: string;

  @Prop({ required: true })
  address: string;

  @Prop({ required: true })
  checkoutUrl: string;

  @Prop({ required: true })
  currencyFrom: string;

  @Prop({ required: true })
  currencyTo: string;

  @Prop({ required: true })
  currencyFromAmount: number;

  @Prop({ required: true })
  currencyToAmount: number;

  @Prop({ default: 'waiting' })
  paymentStatus: string;

  @Prop({ default: 'inactive' })
  conversionStatus: string;
}

export const ConversionSchema = SchemaFactory.createForClass(Conversion);
