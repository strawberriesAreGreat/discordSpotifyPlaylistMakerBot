// utils.ts

export function getRedirect_uri(): string {
  return `${process.env.APP_SCHEME}://${process.env.APP_HOSTNAME}:${process.env.APP_PORT}${process.env.SPOTIFY_OAUTH_REDIRECT_PATH}`;
}
