import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type LearnedDocument = HydratedDocument<Learned>;

@Schema()
export class Learned {
  @Prop()
  title: string;

  @Prop()
  question: string;

  @Prop()
  answer: string;

  @Prop({ required: false })
  tense?: string;

  @Prop([String])
  vocabularies: string[];
}

export const LearnedSchema = SchemaFactory.createForClass(Learned);
