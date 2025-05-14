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
  sectionType: string;
  listIndex?: number;
  isQuote: boolean;
  isCodeBlock: boolean;
  isHighlight: boolean;
  backgroundColor?: string;
}
