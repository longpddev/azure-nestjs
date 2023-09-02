import { readFileSync } from 'fs';
import ONE_THOUSAND_COMMON_WORDS_RANKING from './words.json';
// export const ONE_THOUSAND_COMMON_WORDS_RANKING = JSON.parse(
//   readFileSync('./words.json', { encoding: 'utf-8' }),
// ) as Array<[string, string, string]>;
export const ONE_THOUSAND_COMMON_WORDS = ONE_THOUSAND_COMMON_WORDS_RANKING.map(
  (item) => item[1],
);
