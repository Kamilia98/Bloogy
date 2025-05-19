export enum sectionType {
  paragraph = 'paragraph',
  heading = 'heading',
  list = 'list',
  image = 'image',
  quote = 'quote',
}

export interface Section {
  content: string;
  fontSize: number;
  fontWeight: number;
  fontColor: string;
  fontFamily: string;
  fontStyle: string;
  fontVariant: string;
  lineHeight: number;
  letterSpacing: number;
  textAlign: string;
  textTransform: string;
  textDecoration: string;
  textShadow: string;
  textOverflow: string;
  sectionType: sectionType;
  isQuote: boolean;
  isHighlight: boolean;
  backgroundColor?: string;
}
