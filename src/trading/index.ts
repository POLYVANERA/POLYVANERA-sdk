/**
 * Trading module for Polymarket CLOB (Central Limit Order Book) integration.
 * 
 * This module wraps the @polymarket/clob-client to provide a simplified interface
 * for placing, canceling, and managing orders on Polymarket.
 * 
 * NOTE FOR NEWBIES:
 * - This module handles all the complex parts of trading (signing, order creation, etc.)
 * - You just need to provide your configuration and call simple methods
 * - Make sure you understand the difference between backend and frontend modes
 */

import { ClobClient, Side, Chain } from "@polymarket/clob-client";
import { SignatureType } from "@polymarket/order-utils";
import { BuilderConfig } from "@polymarket/builder-signing-sdk";
import { ethers } from "ethers";
import type { TradingConfig, PlaceOrderParams, Order } from "../types.js";

/**
 * Trading client for interacting with Polymarket's CLOB.
 * 
 * This class provides methods to:
 * - Place limit orders (buy or sell predictions)
 * - Cancel existing orders
 * - Get your open orders
 * - Check order status
 * 
 * @example
 * ```typescript
 * const sdk = new POLYVANERASDK({
 *   trading: {
 *     chainId: 137,
 *     backend: { privateKey: "0x..." },
 *     builder: { key: "...", secret: "...", passphrase: "..." }
 *   }
 * });
 * 
 * const trading = sdk.trading.init();
 * const order = await trading.placeOrder({
 *   tokenId: "123...",
 *   side: "BUY",
 *   price: 0.65,
 *   size: 10
 * });
 * ```
 */
export class TradingClient {
  private client: ClobClient;
  private config: TradingConfig;
  private walletAddress?: string;

  constructor(config: TradingConfig) {
    this.config = config;

    // Validate configuration
    if (!config.backend && !config.frontend) {
      throw new Error(
        "Trading configuration must include either 'backend' or 'frontend' mode. " +
        "For bots/servers use 'backend' with privateKey. " +
        "For web apps use 'frontend' with signer."
      );
    }

    // Setup CLOB client
    const host = config.host || "https://clob.polymarket.com";
    const chainId = (config.chainId || 137) as Chain; // Polygon mainnet

    // Backend mode: using private key
    if (config.backend?.privateKey) {
      const wallet = new ethers.Wallet(config.backend.privateKey);
      this.walletAddress = wallet.address;

      // Prepare API credentials if provided
      const apiCreds = config.builder?.key && config.builder?.secret && config.builder?.passphrase
        ? {
            key: config.builder.key,
            secret: config.builder.secret,
            passphrase: config.builder.passphrase,
          }
        : undefined;

      // Prepare builder config if signing server URL or builder creds are provided
      let builderConfig: BuilderConfig | undefined = undefined;
      if (config.builder?.signingServerUrl) {
        builderConfig = new BuilderConfig({
          remoteBuilderConfig: {
            url: config.builder.signingServerUrl,
          },
        });
      } else if (apiCreds) {
        builderConfig = new BuilderConfig({
          localBuilderCreds: apiCreds,
        });
      }

      // Create CLOB client
      this.client = new ClobClient(
        host,
        chainId,
        wallet as any,
        apiCreds,
        SignatureType.EOA, // Externally Owned Account
        undefined, // funder address
        undefined, // geoBlockToken
        false, // useServerTime
        builderConfig
      );
    }
    // Frontend mode: using provided signer
    else if (config.frontend?.signer) {
      const signer = config.frontend.signer;
      
      // Get wallet address from signer
      if (typeof signer.getAddress === "function") {
        signer.getAddress().then((addr: string) => {
          this.walletAddress = addr;
        });
      }

      // Prepare builder config for signing server if provided
      let builderConfig: BuilderConfig | undefined = undefined;
      if (config.builder?.signingServerUrl) {
        builderConfig = new BuilderConfig({
          remoteBuilderConfig: {
            url: config.builder.signingServerUrl,
          },
        });
      }

      // Create CLOB client
      this.client = new ClobClient(
        host,
        chainId,
        signer,
        undefined, // no API creds in frontend mode
        SignatureType.EOA,
        undefined,
        undefined,
        false,
        builderConfig
      );
    } else {
      throw new Error("Invalid trading configuration");
    }
  }

  /**
   * Place a limit order on Polymarket.
   * 
   * A limit order means you specify the exact price you want to trade at.
   * Your order will only execute if someone else accepts your price.
   * 
   * @param params - Order parameters (tokenId, side, price, size)
   * @returns Promise resolving to the created order
   * 
   * @example
   * ```typescript
   * // Buy 10 YES tokens at 65 cents each
   * const order = await trading.placeOrder({
   *   tokenId: "123...",
   *   side: "BUY",
   *   price: 0.65,
   *   size: 10
   * });
   * console.log("Order placed:", order.orderId);
   * ```
   */
  async placeOrder(params: PlaceOrderParams): Promise<{ orderId: string; status: string }> {
    try {
      // Validate parameters
      if (!params.tokenId) {
        throw new Error("tokenId is required");
      }
      if (!params.side || (params.side !== "BUY" && params.side !== "SELL")) {
        throw new Error("side must be 'BUY' or 'SELL'");
      }
      if (!params.price || params.price <= 0 || params.price >= 1) {
        throw new Error("price must be between 0 and 1 (e.g., 0.65 for 65 cents)");
      }
      if (!params.size || params.size <= 0) {
        throw new Error("size must be greater than 0");
      }

      // Map side to the correct enum
      const side = params.side === "BUY" ? Side.BUY : Side.SELL;

      // Create and post the order using CLOB client
      const response = await this.client.createAndPostOrder({
        tokenID: params.tokenId,
        side: side,
        price: params.price,
        size: params.size,
        // Optional fields
        ...(params.expiration && { expiration: params.expiration }),
        ...(params.nonce && { nonce: params.nonce }),
      });

      return {
        orderId: response.orderID || response.id,
        status: response.status || "success",
      };
    } catch (error: any) {
      throw new Error(`Failed to place order: ${error.message}`);
    }
  }

  /**
   * Cancel an existing order by its ID.
   * 
   * @param orderId - The ID of the order to cancel
   * @returns Promise resolving when the order is canceled
   * 
   * @example
   * ```typescript
   * await trading.cancelOrder("0xabc123...");
   * console.log("Order canceled");
   * ```
   */
  async cancelOrder(orderId: string): Promise<void> {
    try {
      if (!orderId) {
        throw new Error("orderId is required");
      }

      await this.client.cancelOrder({ orderID: orderId });
    } catch (error: any) {
      throw new Error(`Failed to cancel order: ${error.message}`);
    }
  }

  /**
   * Cancel multiple orders at once.
   * 
   * @param orderIds - Array of order IDs to cancel
   * @returns Promise resolving when all orders are canceled
   * 
   * @example
   * ```typescript
   * await trading.cancelOrders(["0xabc...", "0xdef..."]);
   * ```
   */
  async cancelOrders(orderIds: string[]): Promise<void> {
    try {
      if (!orderIds || orderIds.length === 0) {
        throw new Error("orderIds array is required");
      }

      await this.client.cancelOrders(orderIds);
    } catch (error: any) {
      throw new Error(`Failed to cancel orders: ${error.message}`);
    }
  }

  /**
   * Get all open orders for a wallet address.
   * 
   * @param address - Wallet address (optional, uses your wallet if not provided)
   * @returns Promise resolving to array of open orders
   * 
   * @example
   * ```typescript
   * const orders = await trading.getOpenOrders();
   * console.log(`You have ${orders.length} open orders`);
   * 
   * orders.forEach(order => {
   *   console.log(`Order ${order.orderId}: ${order.side} ${order.size} @ $${order.price}`);
   * });
   * ```
   */
  async getOpenOrders(address?: string): Promise<Order[]> {
    try {
      // Note: address parameter is kept for API compatibility but not used
      // The CLOB client automatically uses the authenticated user's address
      const response = await this.client.getOpenOrders();
      
      // Transform API response to our Order type
      return response.map((order) => {
        const sizeMatched = parseFloat(order.size_matched || "0");
        const originalSize = parseFloat(order.original_size || "0");
        const remainingSize = originalSize - sizeMatched;
        
        return {
          orderId: order.id,
          tokenId: order.asset_id,
          side: order.side as "BUY" | "SELL",
          price: parseFloat(order.price),
          originalSize: originalSize,
          size: remainingSize,
          status: order.status || "open",
          timestamp: order.created_at || Date.now(),
          raw: order,
        };
      });
    } catch (error: any) {
      throw new Error(`Failed to get open orders: ${error.message}`);
    }
  }

  /**
   * Get details of a specific order by its ID.
   * 
   * @param orderId - The order ID to look up
   * @returns Promise resolving to the order details
   * 
   * @example
   * ```typescript
   * const order = await trading.getOrder("0xabc123...");
   * console.log(`Order status: ${order.status}`);
   * ```
   */
  async getOrder(orderId: string): Promise<Order | null> {
    try {
      if (!orderId) {
        throw new Error("orderId is required");
      }

      const order = await this.client.getOrder(orderId);
      if (!order) return null;

      const sizeMatched = parseFloat(order.size_matched || "0");
      const originalSize = parseFloat(order.original_size || "0");
      const remainingSize = originalSize - sizeMatched;

      return {
        orderId: order.id,
        tokenId: order.asset_id,
        side: order.side as "BUY" | "SELL",
        price: parseFloat(order.price),
        originalSize: originalSize,
        size: remainingSize,
        status: order.status || "unknown",
        timestamp: order.created_at || Date.now(),
        raw: order,
      };
    } catch (error: any) {
      throw new Error(`Failed to get order: ${error.message}`);
    }
  }

  /**
   * Get the wallet address being used for trading.
   * 
   * @returns The wallet address or undefined if not yet initialized
   */
  getWalletAddress(): string | undefined {
    return this.walletAddress;
  }

  /**
   * Get the underlying CLOB client for advanced usage.
   * 
   * NOTE: This is for advanced users who need direct access to the CLOB client.
   * Most users should use the methods provided by TradingClient instead.
   * 
   * @returns The underlying ClobClient instance
   */
  getRawClient(): ClobClient {
    return this.client;
  }
}

/**
 * Create a new trading client instance.
 * 
 * @param config - Trading configuration
 * @returns A new TradingClient instance
 * 
 * NOTE FOR NEWBIES:
 * This is the main entry point for trading functionality.
 * You'll typically call this via `sdk.trading.init()` rather than directly.
 */
export function createTradingClient(config: TradingConfig): TradingClient {
  return new TradingClient(config);
}
