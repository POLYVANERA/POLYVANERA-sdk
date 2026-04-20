# POLYVANERA SDK

**POLYVANERA SDK** is a complete TypeScript toolkit for **Polymarket** — fetch real-time data, stream live orderbooks, and **execute trades** programmatically.

Build automated trading bots, market-making strategies, dashboards, and AI agents powered by on-chain prediction markets.

[![npm version](https://img.shields.io/npm/v/@POLYVANERA/sdk.svg)](https://www.npmjs.com/package/@POLYVANERA/sdk)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## ✨ Features 

- 🚀 **Fetch live market data** — Get active Polymarket markets and individual market details
- 📊 **Real-time orderbook streaming** — Subscribe to live orderbook updates via WebSocket
- 💰 **Trading integration** — Place, cancel, and manage orders via CLOB
- 🔄 **Relayer support** — Gasless/meta transactions for advanced use cases (NEW!)
- 🏗️ **Builder support** — Attribute orders to your builder account for analytics
- 🔒 **Type-safe** — Full TypeScript support with comprehensive type definitions
- 🪶 **Lightweight** — Minimal dependencies, optimized for performance
- 🎯 **Developer-friendly** — Simple, intuitive API designed for ease of use
- 🤖 **AI-ready** — Perfect for building trading bots and AI agents

> **Note:** This SDK is **not just for data** — it's a complete trading solution with advanced features like gasless transactions!

---

## 📦 Installation

Install via npm:

```bash
npm install @POLYVANERA/sdk
```

Or via yarn:

```bash
yarn add @POLYVANERA/sdk
```

For WebSocket support in Node.js, you'll also need to install `ws`:

```bash
npm install ws
```

> **New to this?** Check out [GUIDE_FOR_NEWBIES.md](./GUIDE_FOR_NEWBIES.md) for a complete step-by-step tutorial!

---

## 🚀 Quick Start

### Data & Streaming (No Trading)

```typescript
import { POLYVANERASDK } from "@POLYVANERA/sdk";

const sdk = new POLYVANERASDK();

// Fetch all active markets
const markets = await sdk.getMarkets();
console.log(`Found ${markets.length} markets`);

// Get a specific market
const market = await sdk.getMarket("market-id-here");
console.log(market.question);
console.log(market.prices);
```

### Real-time Orderbook Streaming

```typescript
import { POLYVANERASDK } from "@POLYVANERA/sdk";

// In Node.js, enable WebSocket support
if (typeof window === "undefined") {
  globalThis.WebSocket = (await import("ws")).default as any;
}

const sdk = new POLYVANERASDK({ debug: true });

// Subscribe to orderbook updates
const unsubscribe = sdk.onOrderbook(
  "market-id-here",
  (update) => {
    if (update.type === "snapshot") {
      const { bids, asks } = update.data;
      console.log("Best bid:", bids[0]?.price);
      console.log("Best ask:", asks[0]?.price);
    } else {
      console.log("Delta update:", update.data);
    }
  },
  {
    onOpen: () => console.log("WebSocket connected"),
    onClose: () => console.log("WebSocket disconnected"),
    onError: (err) => console.error("WebSocket error:", err)
  }
);

// Later: unsubscribe from updates
// unsubscribe();
```

---

## 💰 Trading Quickstart

**NEW!** The SDK now supports placing and managing orders on Polymarket.

### Backend Trading (Bots & Servers)

For automated trading bots and backend services:

```typescript
import { POLYVANERASDK } from "@POLYVANERA/sdk";

// Initialize SDK with trading configuration
const sdk = new POLYVANERASDK({
  trading: {
    chainId: 137, // Polygon mainnet
    backend: {
      privateKey: process.env.PRIVATE_KEY, // Your wallet private key
    },
    // Optional: Builder credentials for order attribution
    builder: {
      key: process.env.BUILDER_KEY,
      secret: process.env.BUILDER_SECRET,
      passphrase: process.env.BUILDER_PASSPHRASE,
    },
  },
});

// Initialize trading client
const trading = sdk.trading.init();

// Place a buy order
const order = await trading.placeOrder({
  tokenId: "0x123...", // Token ID for YES or NO
  side: "BUY",
  price: 0.65, // Buy at 65 cents
  size: 10, // Buy 10 shares
});

console.log("Order placed:", order.orderId);

// Get your open orders
const openOrders = await trading.getOpenOrders();
console.log(`You have ${openOrders.length} open orders`);

// Cancel an order
await trading.cancelOrder(order.orderId);
console.log("Order canceled!");
```

### Frontend Trading (Web Apps)

For browser-based applications where users connect their own wallets:

```typescript
import { POLYVANERASDK } from "@POLYVANERA/sdk";
import { ethers } from "ethers";

// Connect to user's wallet (MetaMask, WalletConnect, etc.)
const provider = new ethers.providers.Web3Provider(window.ethereum);
await provider.send("eth_requestAccounts", []);
const signer = provider.getSigner();

// Initialize SDK with frontend mode
const sdk = new POLYVANERASDK({
  trading: {
    chainId: 137,
    frontend: {
      signer: signer,
    },
    // Optional: Signing server for builder attribution
    builder: {
      signingServerUrl: "https://your-signing-server.com",
    },
  },
});

const trading = sdk.trading.init();

// Place order (user will sign the transaction)
const order = await trading.placeOrder({
  tokenId: "0x123...",
  side: "BUY",
  price: 0.65,
  size: 10,
});
```

### ⚠️ Security Notes

**IMPORTANT:**
- 🔒 **Never expose your private key** in frontend code or public repositories
- ✅ Use environment variables for private keys (backend mode)
- ✅ Use frontend mode for web apps (users control their own keys)
- ✅ Always add `.env` to your `.gitignore`

---

## 🔄 Relayer (Gasless Transactions)

**ADVANCED FEATURE** - For production apps that want to pay gas fees for users.

### What is a Relayer?

A relayer is a service that executes transactions and pays the gas fees on your behalf, enabling **gasless trading** experiences.

**When to use:**
- ✅ Building web apps where you sponsor user gas fees
- ✅ Creating better UX (users don't need ETH/MATIC for gas)
- ✅ Meta-transactions and delegated trading

**When NOT to use:**
- ❌ Simple trading bots (use regular trading instead)
- ❌ Personal trading (just pay your own gas)
- ❌ Development/testing (use regular trading)

### Backend Relayer (Automated Systems)

```typescript
import { POLYVANERASDK } from "@POLYVANERA/sdk";

const sdk = new POLYVANERASDK({
  relayer: {
    chainId: 137,
    backend: {
      privateKey: process.env.PRIVATE_KEY,
    },
  },
});

const relayer = sdk.relayer.init();

// Execute gasless transaction
const response = await relayer.executeProxyTransactions([
  {
    to: "0x...",      // Contract address
    typeCode: "1",    // Call type (1 = Call)
    data: "0x...",    // Encoded function call
    value: "0"        // ETH value (usually "0")
  }
]);

// Wait for confirmation
const result = await relayer.waitForTransaction(response.transactionId);
console.log("Transaction confirmed:", result.transactionHash);
```

### Frontend Relayer (Web Apps)

```typescript
import { POLYVANERASDK } from "@POLYVANERA/sdk";
import { ethers } from "ethers";

const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = provider.getSigner();

const sdk = new POLYVANERASDK({
  relayer: {
    chainId: 137,
    frontend: {
      signer: signer,
    },
  },
});

const relayer = sdk.relayer.init();

// User signs gasless transaction (you pay the gas)
const response = await relayer.executeProxyTransactions([...]);
```

### Relayer Methods

- `relayer.getRelayerAddress()` - Get the relayer's address
- `relayer.getNonce()` - Get current nonce for your wallet
- `relayer.executeProxyTransactions(txs)` - Execute gasless transactions
- `relayer.executeSafeTransactions(txs)` - Execute Safe multi-sig transactions
- `relayer.getTransaction(id)` - Get transaction status
- `relayer.getTransactions()` - Get all your transactions
- `relayer.waitForTransaction(id)` - Wait for transaction confirmation
- `relayer.deploySafe()` - Deploy a Gnosis Safe wallet

---

## 📖 API Reference

### `POLYVANERASDK`

The main SDK class for interacting with Polymarket.

#### Constructor

```typescript
const sdk = new POLYVANERASDK(config?: POLYVANERAConfig);
```

**Configuration Options:**

```typescript
interface POLYVANERAConfig {
  metaBaseUrl?: string;  // API base URL (default: "https://clob.polymarket.com")
  wsBaseUrl?: string;    // WebSocket base URL (default: "wss://clob.polymarket.com/ws")
  debug?: boolean;       // Enable debug logging (default: false)
  trading?: TradingConfig; // Trading configuration (optional)
}

interface TradingConfig {
  host?: string;         // CLOB host (default: "https://clob.polymarket.com")
  chainId?: number;      // Chain ID (default: 137 for Polygon)
  
  // Backend mode (for bots/servers)
  backend?: {
    privateKey: string;  // Your wallet private key
  };
  
  // Frontend mode (for web apps)
  frontend?: {
    signer: any;         // Ethers.js signer from user's wallet
  };
  
  // Builder credentials (optional)
  builder?: {
    key?: string;        // Builder API key
    secret?: string;     // Builder API secret
    passphrase?: string; // Builder API passphrase
    signingServerUrl?: string; // Signing server URL (frontend mode)
  };
}
```

#### Methods

##### `getMarkets(): Promise<Market[]>`

Fetch all active markets from Polymarket.

**Returns:** Array of `Market` objects.

```typescript
const markets = await sdk.getMarkets();
```

##### `getMarket(marketId: string): Promise<Market>`

Fetch a single market by its ID.

**Parameters:**
- `marketId` (string): The unique identifier for the market

**Returns:** A `Market` object.

```typescript
const market = await sdk.getMarket("some-market-id");
```

##### `onOrderbook(marketId, callback, options?): () => void`

Subscribe to real-time orderbook updates for a specific market.

**Parameters:**
- `marketId` (string): The market ID to subscribe to
- `callback` (function): Called with each orderbook update
- `options` (optional): Event handlers for WebSocket lifecycle

**Returns:** Unsubscribe function

```typescript
const unsubscribe = sdk.onOrderbook(
  "market-id",
  (update) => console.log(update),
  {
    onOpen: () => console.log("Connected"),
    onClose: () => console.log("Disconnected"),
    onError: (err) => console.error(err)
  }
);
```

### Trading API

Access trading functionality via `sdk.trading.init()`.

#### `sdk.trading.init(): TradingClient`

Initialize and return a trading client.

**Returns:** TradingClient instance

**Throws:** Error if trading configuration was not provided

```typescript
const trading = sdk.trading.init();
```

### `TradingClient`

Trading client for placing and managing orders.

#### `placeOrder(params): Promise<{ orderId: string; status: string }>`

Place a limit order on Polymarket.

**Parameters:**

```typescript
interface PlaceOrderParams {
  tokenId: string;     // Token ID to trade
  side: "BUY" | "SELL"; // Order side
  price: number;       // Price (0.01 to 0.99)
  size: number;        // Order size/quantity
  expiration?: number; // Optional expiration timestamp
  nonce?: number;      // Optional nonce
}
```

**Returns:** Promise with order ID and status

**Example:**

```typescript
const order = await trading.placeOrder({
  tokenId: "0x123...",
  side: "BUY",
  price: 0.65,
  size: 10
});
```

#### `cancelOrder(orderId): Promise<void>`

Cancel an existing order.

**Parameters:**
- `orderId` (string): The order ID to cancel

**Example:**

```typescript
await trading.cancelOrder("0xabc123...");
```

#### `cancelOrders(orderIds): Promise<void>`

Cancel multiple orders at once.

**Parameters:**
- `orderIds` (string[]): Array of order IDs to cancel

**Example:**

```typescript
await trading.cancelOrders(["0xabc...", "0xdef..."]);
```

#### `getOpenOrders(address?): Promise<Order[]>`

Get all open orders for a wallet address.

**Parameters:**
- `address` (string, optional): Wallet address (uses your wallet if not provided)

**Returns:** Promise resolving to array of Order objects

**Example:**

```typescript
const orders = await trading.getOpenOrders();
orders.forEach(order => {
  console.log(`${order.side} ${order.size} @ $${order.price}`);
});
```

#### `getOrder(orderId): Promise<Order | null>`

Get details of a specific order.

**Parameters:**
- `orderId` (string): The order ID to look up

**Returns:** Promise resolving to Order object or null

**Example:**

```typescript
const order = await trading.getOrder("0xabc123...");
console.log(`Order status: ${order?.status}`);
```

#### `getWalletAddress(): string | undefined`

Get the wallet address being used for trading.

**Returns:** The wallet address or undefined

#### `getRawClient(): ClobClient`

Get the underlying CLOB client for advanced usage.

**Returns:** The underlying ClobClient instance

---

## 🔧 Type Definitions

### `Market`

```typescript
interface Market {
  id: string;                              // Unique market identifier
  question: string;                        // Market question/title
  outcomes: string[];                      // Possible outcomes (e.g., ["YES", "NO"])
  status?: "open" | "closed" | "resolved"; // Market status
  prices?: Record<string, number>;         // Current prices by outcome
  volumeUsd?: number;                      // Total volume in USD
  liquidityUsd?: number;                   // Available liquidity in USD
  raw?: any;                               // Raw API response
}
```

### `OrderbookUpdate`

```typescript
type OrderbookUpdate =
  | { type: "snapshot"; data: OrderbookSnapshot }
  | { type: "delta"; data: Partial<OrderbookSnapshot> };

interface OrderbookSnapshot {
  marketId: string;
  bids: OrderbookLevel[];
  asks: OrderbookLevel[];
  ts: number;
}

interface OrderbookLevel {
  price: number;
  size: number;
}
```

### `Order`

```typescript
interface Order {
  orderId: string;      // Unique order ID
  tokenId: string;      // Token ID being traded
  side: "BUY" | "SELL"; // Order side
  price: number;        // Order price
  originalSize: number; // Original order size
  size: number;         // Remaining unfilled size
  status: string;       // Order status
  timestamp: number;    // Order creation timestamp
  raw?: any;           // Raw order data from API
}
```

---

## ❓ FAQ

### Is this SDK only for data/market streaming?

**No!** The SDK now provides three main features:
1. **Data fetching** - Get market information
2. **Real-time streaming** - Subscribe to live orderbook updates
3. **Trading** - Place, cancel, and manage orders (NEW!)

You can use just the data features without setting up trading, or use the complete trading functionality.

### Why do I need builder config? How is it used?

**Builder configuration is OPTIONAL** but recommended for serious traders.

**What it does:**
- Attributes your orders to your builder account
- Helps with analytics and tracking your order flow
- May provide fee rebates or benefits from Polymarket
- Builds your reputation as a market maker

**How to get it:**
Contact Polymarket to request builder credentials.

**How it's used:**
- **Backend mode**: Pass your builder credentials (key, secret, passphrase)
- **Frontend mode**: Use a signing server URL that you control

### Backend vs Frontend mode - which should I use?

**Use Backend Mode if:**
- 🤖 Building a trading bot or automated strategy
- 🖥️ Running a server-side application
- 🔐 You control the private key

**Use Frontend Mode if:**
- 🌐 Building a web application
- 👤 Users connect their own wallets (MetaMask, etc.)
- 🔒 Users control their own keys

**Security:**
- Backend: Private key is on your server (ensure server security!)
- Frontend: Users control their own keys (more secure for users)

### How do I get a token ID?

Token IDs are found in the market data:

```typescript
const sdk = new POLYVANERASDK();
const market = await sdk.getMarket("market-id");

// Inspect the raw data to find token IDs
console.log(market.raw);

// Markets typically have 2 tokens: one for YES, one for NO
```

You can also use the CLOB API directly to query token information.

### Can I use this in a web browser?

**Yes!** The SDK works in both Node.js and browsers.

**For browser usage:**
1. Use a bundler (Vite, Webpack, Next.js, etc.)
2. Use frontend mode with wallet connection:

```typescript
const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = provider.getSigner();

const sdk = new POLYVANERASDK({
  trading: {
    chainId: 137,
    frontend: { signer }
  }
});
```

### Do I need USDC to trade?

**Yes!** You need USDC (a stablecoin) on the Polygon network.

**How to get USDC on Polygon:**
1. Buy USDC on an exchange (Coinbase, Binance, etc.)
2. Withdraw directly to Polygon network
3. Or bridge from Ethereum using a bridge service

**Note:** Gas fees on Polygon are very low (~$0.01 per transaction).

### How do I keep my private key secure?

**Best practices:**
- ✅ Use environment variables (`.env` file)
- ✅ Add `.env` to your `.gitignore`
- ✅ Never commit private keys to git
- ✅ Use backend mode only on secure servers
- ✅ For web apps, use frontend mode (users control their own keys)
- ❌ Never hardcode private keys in your code
- ❌ Never expose private keys in browser/frontend code

### Is there a testnet?

Polymarket operates primarily on Polygon mainnet. 

**For testing:**
- Start with small amounts (like $1-5)
- Use the data/streaming features without trading
- Test your logic thoroughly before trading large amounts

### What are the trading fees?

Trading on Polymarket includes:
- **Gas fees**: Very low on Polygon (~$0.01-0.02 per transaction)
- **Trading fees**: Check Polymarket's current fee structure
- **Spread costs**: Difference between bid and ask prices

Always start with small orders to understand the total costs.

---

## 💻 Development

### Prerequisites

- Node.js >= 18.0.0
- npm or yarn

### Setup

1. Clone the repository:
```bash
git clone https://github.com/POLYVANERA/POLYVANERA-sdk.git
cd POLYVANERA-sdk
```

2. Install dependencies:
```bash
npm install
```

3. Build the project:
```bash
npm run build
```

### Scripts

- `npm run build` — Compile TypeScript to JavaScript
- `npm run dev` — Watch mode for development
- `npm run clean` — Remove build artifacts
- `npm run examples:list` — Run the list-markets example
- `npm run examples:orderbook` — Run the live-orderbook example

### Running Examples

The `examples/` directory contains sample scripts demonstrating SDK usage:

```bash
# List all markets
npm run examples:list

# Stream live orderbook data (set POLYVANERA_MARKET_ID env var)
POLYVANERA_MARKET_ID=your-market-id npm run examples:orderbook
```

---

## 🛠️ Error Handling

The SDK includes built-in error handling with custom error types:

```typescript
import { POLYVANERASDK, POLYVANERAError, HttpError } from "@POLYVANERA/sdk";

try {
  const market = await sdk.getMarket("invalid-id");
} catch (error) {
  if (error instanceof HttpError) {
    console.error(`HTTP ${error.status}: ${error.message}`);
  } else if (error instanceof POLYVANERAError) {
    console.error(`Error ${error.code}: ${error.message}`);
  }
}
```

---

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 💡 About POLYVANERA

POLYVANERA aims to become the go-to SDK and data layer for **on-chain prediction markets**, starting with **Polymarket**.

Our goal is to make it easy for anyone — from developers to traders — to build tools that enhance their prediction-market experience.

### Features & Roadmap

- ✅ Polymarket data integration
- ✅ Real-time orderbook streaming
- ✅ Trading execution layer (CLOB integration)
- ✅ Relayer support for gasless trades
- ✅ Builder support for order attribution
- 🧠 AI agent compatibility
- 📊 Historical & aggregated market data (coming soon)
- 🌐 Dashboard examples and starter kits (coming soon)

### Follow Us

- 🐦 X (Twitter): [@POLYVANERA](https://x.com/POLYVANERAxyz)
- 🌐 Website: [polyvanera.xyz](polyvanera.xyz)

### $POLYVANERA Token

Native token launched on PumpFun (Solana)  
**Contract Address:** `Launching Soon`

---

## 📄 License

This project is licensed under the [MIT License](./LICENSE).

---

## 🙏 Acknowledgments

Built with ❤️ by the POLYVANERA team for the prediction market community.

Special thanks to [Polymarket](https://polymarket.com) for providing the infrastructure that makes this SDK possible.

---

**© 2026 POLYVANERA** — Building the prediction-market toolkit of the future.
