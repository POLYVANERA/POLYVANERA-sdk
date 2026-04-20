/**
 * Configuration options for the POLYVANERA SDK.
 */
export interface POLYVANERAConfig {
  /** Base URL for market data API (default: https://clob.polymarket.com) */
  metaBaseUrl?: string;
  /** Base URL for WebSocket streams (default: wss://clob.polymarket.com/ws) */
  wsBaseUrl?: string;
  /** Enable debug logging */
  debug?: boolean;
  /** Trading configuration (CLOB client settings) */
  trading?: TradingConfig;
  /** Relayer configuration (for gasless/meta transactions) */
  relayer?: RelayerConfig;
}

/**
 * Trading configuration for CLOB (Central Limit Order Book) integration.
 * This allows you to place, cancel, and manage orders on Polymarket.
 * 
 * NOTE FOR NEWBIES:
 * - Use 'backend' mode if you're running a server/bot with private keys
 * - Use 'frontend' mode if you're building a web app where users sign their own transactions
 */
export interface TradingConfig {
  /** CLOB host URL (default: https://clob.polymarket.com) */
  host?: string;
  /** Blockchain chain ID (137 for Polygon mainnet, default: 137) */
  chainId?: number;
  
  /**
   * Builder configuration (optional).
   * This is used to attribute your orders to your builder account, which can help with:
   * - Analytics and tracking your order flow
   * - Potential fee rebates or benefits from Polymarket
   * - Building a reputation as a market maker
   */
  builder?: BuilderConfig;
  
  /**
   * Backend mode configuration (server-side trading with private key).
   * Use this for trading bots or backend services.
   * IMPORTANT: Never expose your private key in frontend code!
   */
  backend?: {
    /** Your wallet's private key (starts with 0x...) */
    privateKey: string;
  };
  
  /**
   * Frontend mode configuration (browser-based trading with wallet connection).
   * Use this for web apps where users connect their own wallets.
   */
  frontend?: {
    /** Ethereum signer instance (from ethers.js, web3modal, etc.) */
    signer: any; // ethers.Signer
  };
}

/**
 * Builder configuration for attributing orders to your builder account.
 * 
 * NOTE FOR NEWBIES:
 * - Builder credentials are optional but recommended for serious traders
 * - Contact Polymarket to get your builder credentials
 * - Different modes use different credential formats:
 *   - Backend mode: uses key, secret, passphrase
 *   - Frontend mode: uses signingServerUrl (a server you control that signs builder attestations)
 */
export interface BuilderConfig {
  /** Your builder API key (for backend mode) */
  key?: string;
  /** Your builder API secret (for backend mode) */
  secret?: string;
  /** Your builder API passphrase (for backend mode) */
  passphrase?: string;
  /** URL to your signing server (for frontend mode) */
  signingServerUrl?: string;
}

/**
 * Parameters for placing a limit order on Polymarket.
 * 
 * NOTE FOR NEWBIES:
 * - tokenId: The ID of the outcome token you want to trade (YES or NO)
 * - side: "BUY" to buy tokens, "SELL" to sell tokens
 * - price: The price you want to trade at (0.01 to 0.99)
 * - size: The amount of shares you want to trade
 */
export interface PlaceOrderParams {
  /** The token ID of the outcome you want to trade */
  tokenId: string;
  /** Side of the order: "BUY" or "SELL" */
  side: "BUY" | "SELL";
  /** Price in decimal format (e.g., 0.65 for 65 cents) */
  price: number;
  /** Size/quantity of shares to trade */
  size: number;
  /** Expiration timestamp (optional, defaults to ~1 month) */
  expiration?: number;
  /** Nonce for the order (optional, auto-generated if not provided) */
  nonce?: number;
}

/**
 * Represents an open order on Polymarket.
 */
export interface Order {
  /** Unique order ID */
  orderId: string;
  /** Token ID being traded */
  tokenId: string;
  /** Order side (BUY or SELL) */
  side: "BUY" | "SELL";
  /** Order price */
  price: number;
  /** Original order size */
  originalSize: number;
  /** Remaining unfilled size */
  size: number;
  /** Order status */
  status: string;
  /** Order creation timestamp */
  timestamp: number;
  /** Raw order data from API */
  raw?: any;
}

/**
 * Relayer configuration for gasless/meta transactions.
 * 
 * The relayer allows you to submit transactions that are paid for by a relayer service,
 * enabling gasless trading experiences for your users.
 * 
 * NOTE FOR NEWBIES:
 * - Relayer = A service that pays gas fees for you
 * - Use this for: Gasless trading, meta-transactions, sponsored trades
 * - Most use cases DON'T need relayer (regular trading is fine)
 * - This is an ADVANCED feature for production apps
 */
export interface RelayerConfig {
  /** Relayer URL (default: Polymarket's relayer service) */
  relayerUrl?: string;
  /** Chain ID (default: 137 for Polygon mainnet) */
  chainId?: number;
  
  /**
   * Backend mode: Use private key to sign relayer transactions
   * (for automated systems that submit gasless transactions)
   */
  backend?: {
    /** Your wallet's private key */
    privateKey: string;
  };
  
  /**
   * Frontend mode: Use user's wallet signer for relayer transactions
   * (for web apps where users sign gasless transactions)
   */
  frontend?: {
    /** Ethereum signer instance (from ethers.js, web3modal, etc.) */
    signer: any; // Wallet | JsonRpcSigner | WalletClient
  };
  
  /**
   * Optional authentication for relayer service
   * (required if using a private/authenticated relayer)
   */
  auth?: {
    /** Auth service URL */
    authUrl: string;
    /** Auth token */
    authToken: string;
  };
}

/**
 * Response from relayer transaction submission.
 */
export interface RelayerTransactionResponse {
  /** Unique transaction ID from relayer */
  transactionId: string;
  /** Transaction state (NEW, EXECUTED, MINED, etc.) */
  state: string;
  /** Transaction hash (once executed) */
  hash?: string;
  /** Full transaction hash */
  transactionHash?: string;
}

/**
 * Represents a Polymarket prediction market.
 */
export interface Market {
  /** Unique market identifier */
  id: string;
  /** Market question or title */
  question: string;
  /** Possible outcomes (e.g., ["YES", "NO"]) */
  outcomes: string[];
  /** Current market status */
  status?: "open" | "closed" | "resolved";
  /** Current prices by outcome */
  prices?: Record<string, number>;
  /** Total volume traded in USD */
  volumeUsd?: number;
  /** Available liquidity in USD */
  liquidityUsd?: number;
  /** Raw API response data */
  raw?: any;
}

/**
 * Represents a single price level in the orderbook.
 */
export interface OrderbookLevel {
  /** Price at this level */
  price: number;
  /** Order size/quantity at this level */
  size: number;
}

/**
 * Complete orderbook snapshot for a market.
 */
export interface OrderbookSnapshot {
  /** Market identifier */
  marketId: string;
  /** Bid orders (buy side) */
  bids: OrderbookLevel[];
  /** Ask orders (sell side) */
  asks: OrderbookLevel[];
  /** Timestamp of the snapshot */
  ts: number;
}

/**
 * Orderbook update event (snapshot or delta).
 */
export type OrderbookUpdate =
  | { type: "snapshot"; data: OrderbookSnapshot }
  | { type: "delta"; data: Partial<OrderbookSnapshot> };
