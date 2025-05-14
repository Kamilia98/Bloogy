import type { Section } from './SectionModel';

export interface Blog {
  title: string;
  content: string;
  sections: Section[];
  userId?: string;
}
