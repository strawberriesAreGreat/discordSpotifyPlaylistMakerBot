import http, { IncomingMessage, ServerResponse } from 'http';
import { pipe } from 'fp-ts/function';
import * as TE from 'fp-ts/TaskEither';
import {
  InvalidUrlError,
  UrlParametersNotFoundError,
  InvalidAuthCodeError,
} from '../../utils/errors';
import dotenv from 'dotenv';
import { SpotifyCode, SpotifyState, SpotifyTokenData } from '../../utils/types';
import { saveTokenDataToDb } from '../db/saveTokenToDb';
import { getAccessToken } from './services/authorization/getAccessToken';
import { getUserProfile } from './services/authorization/getUserProfile';

dotenv.config();

const server = http.createServer(
  (req: IncomingMessage, res: ServerResponse) => {
    pipe(
      req,
      TE.right,
      TE.chain(validateUrl),
      TE.chain(parseUrl),
      TE.chain(getAuthCode),
      TE.chain(getAccessToken),
      TE.chain(getUserProfile),
      TE.chain(saveTokenDataToDb),
      TE.fold(handleError, () => TE.of(undefined))
    )();

    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.write('<html><body><h2>Auth Done!</h2></body></html>');
    res.end();
  }
);

export function validateUrl(
  req: IncomingMessage
): TE.TaskEither<Error, IncomingMessage> {
  const isFavconUrl: boolean = req.url === '/favicon.ico';
  const validUrl: boolean = req.url
    ? req.method === 'GET' &&
      req.url.startsWith(`${process.env.SPOTIFY_OAUTH_REDIRECT_PATH}`)
    : false;
  return validUrl && !isFavconUrl
    ? TE.right(req)
    : TE.left(new InvalidUrlError());
}

export function parseUrl(
  req: IncomingMessage
): TE.TaskEither<Error, URLSearchParams> {
  const urlParams = new URLSearchParams(req.url?.split('?')[1] || '');

  return urlParams.size === 0
    ? TE.left(new UrlParametersNotFoundError())
    : TE.right(urlParams);
}

export function getAuthCode(
  urlParams: URLSearchParams
): TE.TaskEither<Error, [SpotifyCode, SpotifyState]> {
  const authCode = urlParams.get('code') as SpotifyCode;
  const state = urlParams.get('state') as SpotifyState;

  return authCode != null && state != null
    ? TE.right([authCode, state])
    : TE.left(new InvalidAuthCodeError());
}

const handleError = (e: Error): TE.TaskEither<Error, void> => {
  console.log(e);
  return TE.left(e);
};

export default server;
