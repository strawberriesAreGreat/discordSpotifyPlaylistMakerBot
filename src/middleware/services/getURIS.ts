import url from 'url';
import { parse as pathToRegexp, Key, TokensToRegexpOptions, match } from 'path-to-regexp';
import dotenv from 'dotenv';

dotenv.config();

export function getURIS(str: string): string[] {
    const matches: RegExpMatchArray | null = str.match(/\bhttps?:\/\/\S+/gi);
    const result: string[] = [];

    const options: TokensToRegexpOptions = {
        sensitive: true,
        strict: true,
    };

    if (matches) {
        matches.forEach((element) => {
            try {
                const path: string | null = url.parse(element).pathname;

                if (typeof path === 'string') {
                    const keys: Key[] = [];
                    const re = pathToRegexp('/track/:uri', options);
                    const matched = match('/track/:uri', options)(path);
                    if (matched && matched.params && 'uri' in matched.params) {
                        const uri: string = matched.params.uri as string;
                        result.push(uri);
                    }                
                }
            } catch (e) {
                console.log("ERROR AT: " + element + "\n" + e);
            }
        });
    }

    return result;
}