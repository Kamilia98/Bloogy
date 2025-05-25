import { Prop, Schema } from '@nestjs/mongoose';

@Schema({ _id: false })
export class Section {
  @Prop({ required: true })
  content: string;

  @Prop({ default: 16 })
  fontSize: number;

  @Prop({ default: 400 })
  fontWeight: number;

  @Prop({ default: '#000000' })
  fontColor: string;

  @Prop({ default: 'normal' })
  fontStyle: string;

  @Prop({ default: 'normal' })
  fontVariant: string;

  @Prop({ default: 'left' })
  textAlign: string;

  @Prop({ default: 'none' })
  textDecoration: string;

  @Prop({ default: 'none' })
  textShadow: string;

  @Prop({ default: 'paragraph' })
  sectionType: string;

  @Prop({ default: false })
  isQuote: boolean;

  @Prop({ default: false })
  isCodeBlock: boolean;

  @Prop({ default: false })
  isHighlight: boolean;

  @Prop()
  backgroundColor?: string;
}
