import { transliterate as tr } from 'transliteration';


export const transliterateString = (value: string) => {
  return tr(value);
};
