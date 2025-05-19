import type { Section } from './SectionModel';
import type { User } from './UserModel';

export enum CATEGORY {
  technology = 'technology',
  design = 'design',
  business = 'business',
  lifestyle = 'lifestyle',
}
export interface Blog {
  _id: string;
  title: string;
  thumbnail: string;
  category: CATEGORY;
  sections: Section[];
  user: User;
  createdAt: string;
}
