import {
  InvalidUrlError,
  UrlParametersNotFoundError,
  InvalidAuthCodeError,
  AccessTokenFailure,
} from '../../../../utils/errors';
import { ApiError } from '../../../../utils/errors/CustomError';
import { validateUrl, parseUrl, getAuthCode } from '../../spotifyAuthCallback';
import * as TE from 'fp-ts/TaskEither';
import { IncomingMessage } from 'http';

const REDIRECT_URI = `${process.env.APP_SCHEME}://${process.env.APP_HOSTNAME}:${process.env.APP_PORT}${process.env.SPOTIFY_OAUTH_REDIRECT_PATH}`;

describe('parseUrl', () => {
  it('should return a TaskEither with the request object if the URL is valid', () => {
    const req = {
      url: '/callback',
      method: 'GET',
    } as IncomingMessage;
    expect(validateUrl(req)()).resolves.toEqual({
      _tag: 'Right',
      right: req,
    });
  });
  it('should throw an error for recevieing a favcon url', () => {
    const req = {
      url: '/favcon.ico',
      method: 'GET',
    } as IncomingMessage;
    expect(validateUrl(req)()).resolves.toEqual({
      _tag: 'Left',
      left: new InvalidUrlError(),
    });
  });
  it('should return a TaskEither with an InvalidUrlError if invalid URL is sent', () => {
    const req = {
      url: 'tincan.com:8888/callback?code=AQDKHMDpMp_zIb06Vkao',
      method: 'GET',
    } as IncomingMessage;
    expect(validateUrl(req)()).resolves.toEqual({
      _tag: 'Left',
      left: new InvalidUrlError(),
    });
  });
});
