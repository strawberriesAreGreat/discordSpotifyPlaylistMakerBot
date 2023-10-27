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

const REDIRECT_URI = `${process.env.SCHEME}://${process.env.HOSTNAME}:${process.env.REDIRECT_PORT}${process.env.REDIRECT_PATH}`;

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

// describe.only('parseUrl', () => {
//   // it('Will throw UrlParametersNotFoundError if invalid URL is sent', () => {
//   //   const req = {
//   //     url: '/spotify-auth-callback',
//   //   } as any;
//   //   expect(parseUrl(req)()).resolves.toEqual({
//   //     _tag: 'Left',
//   //     left: new UrlParametersNotFoundError(),
//   //   });
//   // });

// //   it('Will return the URLSearchParams if the URL is valid', () => {
//     const req = {
//       url: '/spotify-auth-callback?code=123',
//     } as any;
//     expect(parseUrl(req)()).resolves.toEqual({
//       _tag: 'Right',
//       left: urlParams.get('code'),
//     });
//   });
// });

// describe('getAuthCode', () => {
//   it('Will throw an InvalidAuthCodeError if the auth code is missing from the URL Params', () => {
//     const urlParams = new URLSearchParams('');

//     expect(() => getAuthCode(urlParams)).toThrow(InvalidAuthCodeError);
//   });

//   it('Will return the auth code if it is present in the URL Params', () => {
//     const urlParams = new URLSearchParams('code=123');

//     expect(getAuthCode(urlParams)).toEqual('123');
//   });
// });

// it('should return a TaskEither with an error when the request fails', async () => {
//   const authCode = process.env.USER_CODE as string;
//   const error = new AccessTokenFailure();
//   const axiosMock = jest.fn().mockRejectedValueOnce(error);
//   jest.mock('axios', () => ({ default: axiosMock }));

//   const result = await requestAccessToken(authCode)();

//   expect(axiosMock).toHaveBeenCalledWith({
//     url: 'https://accounts.spotify.com/api/token',
//     method: 'POST',
//     params: {
//       code: authCode,
//       redirect_uri: REDIRECT_URI,
//       grant_type: 'authorization_code',
//     },
//     headers: {
//       Authorization:
//         'Basic ' +
//         Buffer.from(
//           process.env.SPOTIFY_CLIENT_ID +
//             ':' +
//             process.env.SPOTIFY_CLIENT_SECRET
//         ).toString('base64'),
//     },
//   });
//   expect(result).toEqual(TE.left(new AccessTokenFailure()));
// });
