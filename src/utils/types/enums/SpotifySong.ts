export class SpotifySong {
  constructor(songURI: string) {
    this.songURI = songURI;
  }
  songURI: string;
  count!: number;
  albumURI!: string;
  artistURI!: string;
  availableMarkets!: string;
  discNumber!: number;
  durationMS!: number;
  explicit!: boolean;
  externalIds!: string; // isc, ean, upc
  externalUrls!: string; // spotify
  href!: string;
  isLocal!: boolean;
  isPlayable!: boolean;
  linkedFrom!: string; // spotify
  restrictions!: string; // reason, market
  name!: string;
  popularity!: number;
  previewUrl!: string;
  trackNumber!: number;
  danceability!: number;
  duration_ms!: number;
  energy!: number;
  instrumentalness!: number;
  key!: number;
  liveness!: number;
  loudness!: number;
  mode!: number;
  speechiness!: number;
  valence!: number;
  acousticness!: number;
  time_signature!: number;
}
