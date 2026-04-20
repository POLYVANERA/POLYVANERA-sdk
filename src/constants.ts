/**
 * Default configuration values for the POLYVANERA SDK.
 */
export const DEFAULTS = {
  /** Default API base URL for Polymarket CLOB */
  metaBaseUrl: "https://clob.polymarket.com",
  /** Default WebSocket base URL for real-time data */
  wsBaseUrl: "wss://clob.polymarket.com/ws",
  /** Debug mode disabled by default */
  debug: false
} as const;
