import url from 'url';
import {
  parse as pathToRegexp,
  Key,
  TokensToRegexpOptions,
  match,
} from 'path-to-regexp';
import dotenv from 'dotenv';

dotenv.config();

// returns array of string arrays, length 100 each
export function getURIS(str: string): string[][] {
  // // const matches: RegExpMatchArray | null = str.match(/\bhttps?:\/\/\S+/gi);
  // // const result: string[][];
  // // const options: TokensToRegexpOptions = {
  // //   sensitive: true,
  // //   strict: true,
  // // };
  // // if (matches) {
  // //   let subArray: string[] = [];
  // //   matches.forEach((element, index) => {
  // //     try {
  // //       const path: string | null = url.parse(element).pathname;
  // //       if (typeof path === 'string') {
  // //         const keys: Key[] = [];
  // //         const re = pathToRegexp('/track/:uri', options);
  // //         const matched = match('/track/:uri', options)(path);
  // //         if (matched && matched.params && 'uri' in matched.params) {
  // //           const uri: string = matched.params.uri as string;
  // //           subArray.push(uri);
  // //         }
  // //         if (subArray.length === 100 || index === matches.length - 1) {
  // //           result.push(subArray);
  // //           subArray = [];
  // //         }
  // //       }
  // //     } catch (e) {
  // //       console.log(e);
  // //       new Error(e as string);
  // //     }
  // //   });
  // // }
  // return result;
  return [];
}
