import { DEFAULTS } from "./constants.js";
import { createLogger } from "./utils/logger.js";
import { withRetry } from "./utils/retry.js";
import { pmFetchMarkets, pmFetchMarket } from "./providers/polymarket.js";
import { pmSubscribeOrderbook } from "./streams/orderbook.js";
import { TradingClient, createTradingClient } from "./trading/index.js";
import { RelayerClient, createRelayerClient } from "./relayer/index.js";
import type { POLYVANERAConfig, Market, OrderbookUpdate } from "./types.js";

/**
 * Main SDK class for interacting with Polymarket.
 * 
 * This SDK provides FOUR main features:
 * 1. Data fetching - Get market data and information
 * 2. Real-time streaming - Subscribe to live orderbook updates
 * 3. Trading - Place, cancel, and manage orders
 * 4. Relayer - Gasless/meta transactions (ADVANCED)
 * 
 * NOTE FOR NEWBIES:
 * - You can use this SDK just for data (no trading setup needed)
 * - To enable trading, pass a 'trading' config with your wallet/builder info
 * - To enable relayer (gasless trades), pass a 'relayer' config
 * - Most users only need data + trading (relayer is advanced)
 * 
 * @example
 * ```typescript
 * // Data-only usage (no trading)
 * const sdk = new POLYVANERASDK({ debug: true });
 * const markets = await sdk.getMarkets();
 * 
 * // With trading enabled
 * const sdk = new POLYVANERASDK({
 *   trading: {
 *     chainId: 137,
 *     backend: { privateKey: "0x..." }
 *   }
 * });
 * const trading = sdk.trading.init();
 * await trading.placeOrder({...});
 * 
 * // With relayer enabled (gasless trades)
 * const sdk = new POLYVANERASDK({
 *   relayer: {
 *     chainId: 137,
 *     backend: { privateKey: "0x..." }
 *   }
 * });
 * const relayer = sdk.relayer.init();
 * await relayer.executeProxyTransactions([...]);
 * ```
 */
export class POLYVANERASDK {
  readonly metaBaseUrl: string;
  readonly wsBaseUrl: string;
  private log: ReturnType<typeof createLogger>;
  private tradingConfig?: POLYVANERAConfig["trading"];
  private relayerConfig?: POLYVANERAConfig["relayer"];

  /**
   * Trading namespace - access trading functionality here.
   * 
   * Call `sdk.trading.init()` to get a trading client.
   * 
   * @example
   * ```typescript
   * const trading = sdk.trading.init();
   * await trading.placeOrder({...});
   * ```
   */
  public readonly trading: {
    /**
     * Initialize and return a trading client.
     * 
     * @returns TradingClient instance for placing/managing orders
     * @throws Error if trading configuration was not provided to SDK constructor
     */
    init: () => TradingClient;
  };

  /**
   * Relayer namespace - access gasless transaction functionality here.
   * 
   * Call `sdk.relayer.init()` to get a relayer client.
   * 
   * NOTE: This is an ADVANCED feature. Most users don't need relayer.
   * Use regular trading unless you specifically need gasless transactions.
   * 
   * @example
   * ```typescript
   * const relayer = sdk.relayer.init();
   * const response = await relayer.executeProxyTransactions([...]);
   * await relayer.waitForTransaction(response.transactionId);
   * ```
   */
  public readonly relayer: {
    /**
     * Initialize and return a relayer client.
     * 
     * @returns RelayerClient instance for gasless transactions
     * @throws Error if relayer configuration was not provided to SDK constructor
     */
    init: () => RelayerClient;
  };

  /**
   * Create a new instance of the POLYVANERA SDK.
   * 
   * @param cfg - Configuration options for the SDK
   */
  constructor(cfg: POLYVANERAConfig = {}) {
    this.metaBaseUrl = cfg.metaBaseUrl ?? DEFAULTS.metaBaseUrl;
    this.wsBaseUrl = cfg.wsBaseUrl ?? DEFAULTS.wsBaseUrl;
    this.log = createLogger(!!cfg.debug);
    this.tradingConfig = cfg.trading;
    this.relayerConfig = cfg.relayer;
    
    this.log.info("init", { 
      metaBaseUrl: this.metaBaseUrl, 
      wsBaseUrl: this.wsBaseUrl,
      tradingEnabled: !!cfg.trading,
      relayerEnabled: !!cfg.relayer
    });

    // Setup trading namespace
    this.trading = {
      init: () => {
        if (!this.tradingConfig) {
          throw new Error(
            "Trading is not configured. Please pass 'trading' config to POLYVANERASDK constructor. " +
            "Example: new POLYVANERASDK({ trading: { chainId: 137, backend: { privateKey: '0x...' } } })"
          );
        }
        return createTradingClient(this.tradingConfig);
      },
    };

    // Setup relayer namespace
    this.relayer = {
      init: () => {
        if (!this.relayerConfig) {
          throw new Error(
            "Relayer is not configured. Please pass 'relayer' config to POLYVANERASDK constructor. " +
            "Example: new POLYVANERASDK({ relayer: { chainId: 137, backend: { privateKey: '0x...' } } })\n" +
            "Note: Relayer is for ADVANCED gasless transactions. Most users should use 'trading' instead."
          );
        }
        return createRelayerClient(this.relayerConfig);
      },
    };
  }

  /**
   * Fetch all active markets from Polymarket.
   * 
   * @returns Promise resolving to an array of Market objects
   * @throws {HttpError} If the API request fails
   */
  async getMarkets(): Promise<Market[]> {
    return withRetry(() => pmFetchMarkets(this.metaBaseUrl));
  }

  /**
   * Fetch a single market by its ID.
   * 
   * @param marketId - The unique identifier for the market
   * @returns Promise resolving to a Market object
   * @throws {HttpError} If the API request fails
   */
  async getMarket(marketId: string): Promise<Market> {
    return withRetry(() => pmFetchMarket(this.metaBaseUrl, marketId));
  }

  /**
   * Subscribe to live orderbook updates for a specific market via WebSocket.
   * 
   * @param marketId - The market ID to subscribe to
   * @param cb - Callback function invoked with each orderbook update
   * @param opts - Optional event handlers for WebSocket lifecycle events
   * @returns Unsubscribe function to stop receiving updates
   * 
   * @example
   * ```typescript
   * const unsubscribe = sdk.onOrderbook(
   *   "market-id",
   *   (update) => console.log(update),
   *   { onOpen: () => console.log("Connected") }
   * );
   * // Later: unsubscribe()
   * ```
   */
  onOrderbook(
    marketId: string,
    cb: (u: OrderbookUpdate) => void,
    opts?: { onError?: (e: any) => void; onOpen?: () => void; onClose?: () => void }
  ): () => void {
    return pmSubscribeOrderbook(this.wsBaseUrl, marketId, cb, opts);
  }
}
