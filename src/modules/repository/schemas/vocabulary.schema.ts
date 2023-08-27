import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type VocabularyDocument = HydratedDocument<Vocabulary>;

@Schema()
export class Vocabulary {
  @Prop()
  name: string;

  @Prop()
  description: string;

  @Prop()
  learned: boolean;
}

export const VocabularySchema = SchemaFactory.createForClass(Vocabulary);
