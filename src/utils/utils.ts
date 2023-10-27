// utils.ts

export function getRedirect_uri(): string {
  return `${process.env.SCHEME}://${process.env.HOSTNAME}:${process.env.REDIRECT_PORT}${process.env.REDIRECT_PATH}`;
}
