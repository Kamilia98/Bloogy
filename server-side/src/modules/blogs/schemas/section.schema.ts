import { Prop, Schema } from '@nestjs/mongoose';

@Schema({ _id: false })
export class Section {
  @Prop({ required: true })
  content: string;

  // --- Font Styling ---
  @Prop({ default: 16 })
  fontSize: number;

  @Prop({ default: 400 })
  fontWeight: number;

  @Prop({ default: '#000000' })
  fontColor: string;

  @Prop({ default: 'Arial' })
  fontFamily: string;

  @Prop({ default: 'normal' })
  fontStyle: string;

  @Prop({ default: 'normal' })
  fontVariant: string;

  @Prop({ default: 1.5 })
  lineHeight: number;

  @Prop({ default: 0 })
  letterSpacing: number;

  // --- Text Layout ---
  @Prop({ default: 'left' })
  textAlign: string;

  @Prop({ default: 'none' })
  textTransform: string;

  @Prop({ default: 'none' })
  textDecoration: string;

  @Prop({ default: 'none' })
  textShadow: string;

  @Prop({ default: 'clip' })
  textOverflow: string;

  // --- Section-specific Props ---
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
