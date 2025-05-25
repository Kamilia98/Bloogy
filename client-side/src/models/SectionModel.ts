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
  fontStyle: string;
  fontVariant: string;
  textAlign: string;
  textDecoration: string;
  sectionType: sectionType;
  isQuote: boolean;
  isHighlight: boolean;
  backgroundColor?: string;
}
