import http, { IncomingMessage, ServerResponse } from 'http';
import { pipe } from 'fp-ts/function';
import * as TE from 'fp-ts/TaskEither';
import {
  InvalidUrlError,
  UrlParametersNotFoundError,
  InvalidAuthCodeError,
  AccessTokenFailure,
} from '../../errors';
import { ApiError } from '../../errors/CustomError';
import dotenv from 'dotenv';
import axios from 'axios';
import { Buffer } from 'buffer';
import { decryptState } from '..';
import { DiscordUser } from '../../db/models/DiscordUser';
import { SpotifyToken } from '../../db/models/SpotifyToken';
const REDIRECT_URI = `${process.env.SCHEME}://${process.env.HOSTNAME}:${process.env.REDIRECT_PORT}${process.env.REDIRECT_PATH}`;

dotenv.config();

type AuthCode = string;
type State = string;
type AuthCodeAndState = {
  authcode: AuthCode;
  state: State;
};
type SpotifyTokenData = {
  access_token: string;
  refresh_token: string;
  state: string;
  scope: string;
  expires_in: number;
  token_type: string;
};

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
  const isFavconUrl: boolean = req.url === '/favicon.ico';
  const validUrl: boolean = req.url
    ? req.method === 'GET' && req.url.startsWith(`${process.env.REDIRECT_PATH}`)
    : false;
  console.log('validUrl', validUrl);
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
): TE.TaskEither<Error, AuthCodeAndState> {
  const authCode = urlParams.get('code') as string;
  const state = urlParams.get('state') as string;
  const authCodeAndState: AuthCodeAndState = {
    authcode: authCode,
    state: state,
  };

  return authCode != null && state != null
    ? TE.right(authCodeAndState)
    : TE.left(new InvalidAuthCodeError());
}

export function requestAccessToken(
  authCodeAndState: AuthCodeAndState
): TE.TaskEither<Error, SpotifyTokenData> {
  const authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    method: 'POST',
    params: {
      code: authCodeAndState.authcode,
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
            state: authCodeAndState.state,
            scope: response.data.scope,
            expires_in: response.data.expires_in,
            token_type: response.data.token_type,
          })
        : TE.left(new AccessTokenFailure())
    )
  );
}

export function saveTokenDataToDb(tokens: SpotifyTokenData) {
  const discordUserID = decryptState(tokens.state);
  const token = tokens.access_token;
  const refreshToken = tokens.refresh_token;
  const scope = tokens.scope;
  const expiresIn = tokens.expires_in;
  const tokenType = tokens.token_type;
  const tokenExpiryTime = new Date(Date.now() + expiresIn * 1000);

  DiscordUser.findOne({
    where: {
      discordId: discordUserID,
    },
  })
    .then((user) => {
      if (!user) {
        throw new Error(`Discord user with ID ${discordUserID} not found`);
      }

      return SpotifyToken.create({
        discord_user_id: discordUserID,
      });
    })
    .then((spotifyToken) => {
      if (!spotifyToken) {
        return SpotifyToken.create({
          access_token: token,
          refresh_token: refreshToken,
          scope: scope,
          expires_in: expiresIn,
          token_type: tokenType,
          token_expiry: tokenExpiryTime,
          discord_user_id: discordUserID,
        });
      } else {
        return spotifyToken.update({
          access_token: token,
          refresh_token: refreshToken,
          scope: scope,
          expires_in: expiresIn,
          token_type: tokenType,
          token_expiry: tokenExpiryTime,
        });
      }
    })
    .then(() => {
      return TE.right(undefined);
    })
    .catch((error: Error) => {
      return TE.left(error);
    });
}

// export function saveTokenDataToDb(
//   tokens: TokensAndState
// ): TE.TaskEither<Error, void> {
//   let discordUserID = decryptState(tokens.state);
//   let token = tokens.access_token;
//   let refreshToken = tokens.refresh_token;

//   console.log('tokens', JSON.stringify(tokens));
//   console.log(decryptState(process.env.USER_STATE as string));
//   return TE.right(void 0);
// }

const handleError = (e: Error): TE.TaskEither<Error, void> => {
  console.log(e);
  return TE.left(e);
};

export default server;
