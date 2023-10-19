import {
  InvalidUrlError,
  UrlParametersNotFoundError,
  InvalidAuthCodeError,
} from './errors';
import { ApiError } from './errors/CustomError';
import {
  validateUrl,
  parseUrl,
  getAuthCode,
  saveRefreshToken,
} from './spotifyAuthCallback';

describe('validateUrl', () => {
  it('Will throw InvalidUrlError if invalid URL is sent', () => {
    const req = {
      url: 'tincan.com:8888/callback?code=AQDKHMDpMp_zIb06Vkao',
      method: 'GET',
    } as any;

    expect(() => validateUrl(req)).toThrow(InvalidUrlError);
  });

  it.only('Will return the request object if the URL is valid', () => {
    const req = {
      url: '/callback',
      method: 'GET',
    } as any;

    expect(validateUrl(req)).toEqual(req);
  });
});

describe('parseUrl', () => {
  it('Will throw UrlParametersNotFoundError if invalid URL is sent', () => {
    const req = {
      url: '/spotify-auth-callback',
    } as any;
    expect(() => parseUrl(req)).toThrow(UrlParametersNotFoundError);
  });

  it('Will return the URLSearchParams if the URL is valid', () => {
    const req = {
      url: '/spotify-auth-callback?code=123',
    } as any;

    expect(parseUrl(req)).toEqual(new URLSearchParams('code=123'));
  });
});

describe('getAuthCode', () => {
  it('Will throw an InvalidAuthCodeError if the auth code is missing from the URL Params', () => {
    const urlParams = new URLSearchParams('');

    expect(() => getAuthCode(urlParams)).toThrow(InvalidAuthCodeError);
  });

  it('Will return the auth code if it is present in the URL Params', () => {
    const urlParams = new URLSearchParams('code=123');

    expect(getAuthCode(urlParams)).toEqual('123');
  });
});

// describe('saveRefreshToken', () => {
//   it('Will return true if the auth code is saved to the database', () => {
//     const authCode = '123';

//     expect(saveRefreshToken(authCode)).toBe(true);
//   });
// });

// describe('saveRefreshToken', () => {
//   it('should log an error message when the refreshResult is a left', async () => {
//     const error: ApiError = new InvalidAuthCodeError();
//     const refreshResult = TE.left(error);
//     const consoleSpy = jest.spyOn(console, 'log');

//     await saveRefreshToken(refreshResult)();

//     expect(consoleSpy).toHaveBeenCalledWith(
//       'Error refreshing access token:',
//       error.message
//     );
//   });

//   it('should log an access token when the refreshResult is a right', async () => {
//     const accessToken = 'testAccessToken';
//     const refreshResult = TE.right(accessToken);
//     const consoleSpy = jest.spyOn(console, 'log');

//     await saveRefreshToken(refreshResult)();

//     expect(consoleSpy).toHaveBeenCalledWith(
//       'Access token refreshed successfully:',
//       accessToken
//     );
//   });
// });
