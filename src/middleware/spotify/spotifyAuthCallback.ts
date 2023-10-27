import http, { IncomingMessage, ServerResponse } from 'http';
import { pipe } from 'fp-ts/function';
import * as TE from 'fp-ts/TaskEither';
import {
  InvalidUrlError,
  UrlParametersNotFoundError,
  InvalidAuthCodeError,
  AccessTokenFailure,
} from '../../utils/errors';
import { ApiError } from '../../utils/errors/CustomError';
import dotenv from 'dotenv';
import axios from 'axios';
import { Buffer } from 'buffer';
const REDIRECT_URI = `${process.env.APP_SCHEME}://${process.env.APP_HOSTNAME}:${process.env.APP_PORT}${process.env.SPOTIFY_OAUTH_REDIRECT_PATH}`;

dotenv.config();

type AuthCode = string;
type Tokens = { access_token: string; refresh_token: string };

const server = http.createServer(
  (req: IncomingMessage, res: ServerResponse) => {
    pipe(
      req,
      TE.right,
      TE.chain(validateUrl),
      TE.chain(parseUrl),
      TE.chain(getAuthCode),
      TE.chain(requestAccessToken),
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
  console.log('validateUrl');
  console.log('req.url', req.url);
  console.log(process.env.SPOTIFY_OAUTH_REDIRECT_PATH);
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
): TE.TaskEither<Error, AuthCode> {
  const authCode = urlParams.get('code');

  return authCode === null
    ? TE.left(new InvalidAuthCodeError())
    : TE.right(authCode);
}

export function requestAccessToken(
  authCode: AuthCode
): TE.TaskEither<Error, Tokens> {
  const authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    method: 'POST',
    params: {
      code: authCode,
      redirect_uri: REDIRECT_URI,
      grant_type: 'authorization_code',
    },
    headers: {
      Authorization:
        'Basic ' +
        Buffer.from(
          process.env.SPOTIFY_CLIENT_ID +
            ':' +
            process.env.SPOTIFY_CLIENT_SECRET
        ).toString('base64'),
    },
  };

  return pipe(
    TE.tryCatch(
      () => axios(authOptions),
      () => new AccessTokenFailure()
    ),
    TE.chain((response) =>
      response.status === 200 && response.data.access_token !== null
        ? TE.right({
            access_token: response.data.access_token,
            refresh_token: response.data.refresh_token,
          })
        : TE.left(new AccessTokenFailure())
    )
  );
}

export function saveTokenDataToDb(tokens: Tokens): TE.TaskEither<Error, void> {
  DiscordUser.findOne({ where: { discordId: discordId } })
    .then((user) => {
      if (user) {
        SpotifyToken.create({
          accessToken: tokens.access_token,
          refreshToken: tokens.refresh_token,
          discordUserId: user.id,
        });
      }
    })
    .catch((error) => {
      console.log(`Error saving token data to db: ${error}`);
    });

  return TE.right(void 0);
}

const handleError = (e: Error): TE.TaskEither<Error, void> => {
  console.log(e);
  return TE.left(e);
};

export default server;
