jest.useFakeTimers();
import { InvalidUrlError } from '../../../utils/errors';
import { validateUrl } from '../spotifyAuthServer';
import { IncomingMessage } from 'http';

jest.mock('../../../models/DiscordUser');
jest.mock('../../../models/SpotifyToken');
jest.mock('../../../services');

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
