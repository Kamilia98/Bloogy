import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { Prop } from '@nestjs/mongoose';
import { Section } from './section.schema';
import mongoose, { Types } from 'mongoose';
import { User } from 'src/modules/users/schemas/user.schema';

export type BlogDocument = Blog & Document;

@Schema()
export class Blog {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  thumbnail: string;

  @Prop({ required: true })
  category: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: User.name,
    required: true,
  })
  user: Types.ObjectId;

  @Prop({ default: false })
  isDeleted: boolean;

  @Prop({ type: [Section], default: [] }) // <-- Embedded sections
  sections: Section[];
}

export const BlogSchema = SchemaFactory.createForClass(Blog);

// Add timestamps option
BlogSchema.set('timestamps', true);
