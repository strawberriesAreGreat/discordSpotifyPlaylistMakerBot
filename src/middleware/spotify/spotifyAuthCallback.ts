import http, { IncomingMessage, ServerResponse } from 'http';
import { pipe } from 'fp-ts/function';
import * as TE from 'fp-ts/TaskEither';
import {
  InvalidUrlError,
  UrlParametersNotFoundError,
  InvalidAuthCodeError,
  AccessTokenFailure,
} from '../../utils/errors';
import dotenv from 'dotenv';
import axios from 'axios';
import { Buffer } from 'buffer';
import { decryptString, encryptString, hashDiscordId } from '../../services';
import { DiscordUser } from '../../models/DiscordUser';
import { SpotifyToken } from '../../models/SpotifyToken';
import { getRedirect_uri } from '../../utils/utils';
import {
  DiscordId,
  EncryptedString,
  SpotifyTokenData,
} from '../../utils/types';

const REDIRECT_URI = getRedirect_uri();

dotenv.config();

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
): TE.TaskEither<Error, SpotifyTokenData> {
  const authCode = urlParams.get('code') as string;
  const state = urlParams.get('state') as EncryptedString;
  const authCodeAndState: SpotifyTokenData = {
    code: authCode,
    state: state,
  };

  return authCode != null && state != null
    ? TE.right(authCodeAndState)
    : TE.left(new InvalidAuthCodeError());
}

export function requestAccessToken(
  spotifyData: SpotifyTokenData
): TE.TaskEither<Error, SpotifyTokenData> {
  const authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    method: 'POST',
    params: {
      code: spotifyData.code,
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
            access_token: encryptString(
              response.data.access_token as string,
              process.env.ENCRYPTION_SECRET as string
            ),
            refresh_token: encryptString(
              response.data.refresh_token as string,
              process.env.ENCRYPTION_SECRET as string
            ),
            state: spotifyData.state,
            scope: response.data.scope,
            expires_in: response.data.expires_in,
            token_type: response.data.token_type,
          })
        : TE.left(new AccessTokenFailure())
    )
  );
}

export function saveTokenDataToDb(
  spotifyData: SpotifyTokenData
): TE.TaskEither<Error, void> {
  let secret: string = process.env.ENCRYPTION_SECRET as string;
  const discordUserID: DiscordId = hashDiscordId(
    decryptString(spotifyData.state as EncryptedString, secret)
  );
  const token = spotifyData.access_token;
  const refreshToken = spotifyData.refresh_token;
  const scope: string = spotifyData.scope as string;
  const tokenExpiry = spotifyData.expires_in as number;
  const tokenExpiryTimestamp = new Date(Date.now() + tokenExpiry * 1000);

  return pipe(
    TE.tryCatch(
      () =>
        DiscordUser.findOne({
          where: {
            discordId: discordUserID,
          },
        }),
      (err) => new Error(`Failed to find DiscordUser: ${err}`)
    ),
    TE.chain((user) =>
      user
        ? TE.right(user)
        : TE.tryCatch(
            () =>
              DiscordUser.create({
                discordId: discordUserID,
              }),
            (err) => new Error(`Failed to create DiscordUser: ${err}`)
          )
    ),
    TE.chain((user) =>
      TE.tryCatch(
        () =>
          SpotifyToken.create({
            access_token: token,
            refresh_token: refreshToken,
            scope: scope,
            token_expiry: tokenExpiry,
            token_expiry_timestamp: tokenExpiryTimestamp,
            discord_user_id: user.discordId,
          }),
        (err) => new Error(`Failed to create SpotifyToken: ${err}`)
      )
    ),
    TE.map(() => undefined)
  );
}

const handleError = (e: Error): TE.TaskEither<Error, void> => {
  console.log(e);
  return TE.left(e);
};

export default server;
