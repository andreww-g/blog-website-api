import { slugify as sl } from 'transliteration';


export const slugifyString = (value: string) => {
  return sl(value);
};
