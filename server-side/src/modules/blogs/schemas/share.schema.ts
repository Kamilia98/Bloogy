import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, Types } from 'mongoose';
import { User } from 'src/modules/users/schemas/user.schema';
import { Blog } from './blog.schema';

export type ShareDocument = Share & Document;

@Schema({ timestamps: true })
export class Share {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: Blog.name,
    required: true,
  })
  blog: Types.ObjectId;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: User.name,
    required: true,
  })
  sharedBy: Types.ObjectId;
}

export const ShareSchema = SchemaFactory.createForClass(Share);
