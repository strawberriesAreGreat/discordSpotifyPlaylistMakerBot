import http, { IncomingMessage, ServerResponse } from 'http';
import { flow, pipe } from 'fp-ts/function';
import { Task } from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { Either, fold } from 'fp-ts/Either';
import {
  InvalidUrlError,
  UrlParametersNotFoundError,
  InvalidAuthCodeError,
  AccessTokenFailure,
  RefreshTokenFailure,
} from './errors';
import { ApiError } from './errors/CustomError';
import dotenv from 'dotenv';
import axios from 'axios';
import { Buffer } from 'buffer';

dotenv.config();

type AuthCode = string;

const server = http.createServer(
  (req: IncomingMessage, res: ServerResponse) => {
    try {
      pipe(
        req,
        validateUrl,
        parseUrl,
        getAuthCode,
        requestAccessToken,
        saveRefreshToken
      );
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.write('<html><body><h2>Auth Done!</h2></body></html>');
      res.end();
    } catch (e) {
      console.log(e);

      // TODO: Return error response
      // res.writeHead(404, { 'Content-Type': 'text/plain' });
      // res.end('Not found.');
    }
  }
);

server.listen(process.env.PORT || 3333, () => {
  console.log(`Server listening on port ${process.env.PORT || 8888}`);
});

export function validateUrl(req: IncomingMessage): IncomingMessage {
  console.log('Validating URL');
  const validUrl: boolean = req.url
    ? req.method === 'GET' && req.url.startsWith(`${process.env.REDIRECT_PATH}`)
    : false;
  console.log('Validating URL:', validUrl);
  console.log('req.url:', req.url);
  console.log('req.path:', process.env.REDIRECT_PATH);
  if (!validUrl) {
    throw new InvalidUrlError();
  }

  return req;
}

export function parseUrl(req: IncomingMessage): URLSearchParams {
  console.log('Parsing URL');
  const urlParams = new URLSearchParams(req.url?.split('?')[1] || '');
  if (urlParams.size === 0) {
    throw new UrlParametersNotFoundError();
  }

  return urlParams;
}

export const getAuthCode = (urlParams: URLSearchParams): AuthCode => {
  console.log('Getting auth code');
  const authCode = urlParams.get('code');

  if (authCode === null) {
    throw new InvalidAuthCodeError();
  }
  console.log('AuthCode ' + authCode);
  return authCode;
};

export const requestAccessToken = (
  authCode: AuthCode
): TE.TaskEither<ApiError, string> => {
  const authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    method: 'POST',
    params: {
      code: authCode,
      redirect_uri: process.env.REDIRECT_URI,
      grant_type: 'authorization_code',
    },
    headers: {
      Authorization:
        'Basic ' +
        Buffer.from(
          process.env.CLIENT_ID + ':' + process.env.CLIENT_SECRET
        ).toString('base64'),
    },
  };

  return pipe(
    TE.tryCatch(
      () => axios(authOptions),
      (error) => AccessTokenFailure
    ),
    TE.mapLeft(() => new AccessTokenFailure()),
    TE.map((response) => response.data.access_token)
  );
};

export const refreshedAccessToken = (
  refreshToken: string
): TE.TaskEither<ApiError, string> => {
  console.log('refreshing acces token');
  const authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    method: 'POST',
    params: {
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    },
    headers: {
      Authorization:
        'Basic ' +
        Buffer.from(
          process.env.CLIENT_ID + ':' + process.env.CLIENT_SECRET
        ).toString('base64'),
    },
  };

  return pipe(
    TE.tryCatch(
      () => axios(authOptions),
      (error) => RefreshTokenFailure
    ),
    TE.mapLeft(() => new AccessTokenFailure()),
    TE.map((response) => response.data.access_token)
  );
};

export async function saveRefreshToken(
  refreshResult: TE.TaskEither<ApiError, string>
) {
  console.log('Saving refresh token');
  const result = await refreshResult();

  console.log(result);

  pipe(
    refreshResult,
    TE.fold(
      (error) => {
        console.log('Error refreshing access token:', error.message);
        return TE.left(error);
      },
      (accessToken) => {
        console.log('Access token refreshed successfully:', accessToken);
        return TE.right(accessToken);
      }
    )
  );
  console.log('Saved refresh token');
}

export default server;
