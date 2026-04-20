# Changelog

All notable changes to the POLYVANERA SDK will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.4.0] - 2026-01-01

### Added
- **Trading Module** - Complete CLOB client integration for executing trades
  - `sdk.trading.init()` - Initialize trading client
  - `trading.placeOrder()` - Place limit buy/sell orders
  - `trading.cancelOrder()` - Cancel single order
  - `trading.cancelOrders()` - Cancel multiple orders
  - `trading.getOpenOrders()` - Get all open orders
  - `trading.getOrder()` - Get specific order details
  - Backend mode with private key authentication
  - Frontend mode with wallet signer for web apps
  - Builder configuration support for order attribution

- **Relayer Module** - Gasless transaction support for better UX
  - `sdk.relayer.init()` - Initialize relayer client
  - `relayer.executeProxyTransactions()` - Execute gasless proxy transactions
  - `relayer.executeSafeTransactions()` - Execute Gnosis Safe multi-sig transactions
  - `relayer.deploySafe()` - Deploy new Safe wallet
  - `relayer.waitForTransaction()` - Wait for transaction confirmation with polling
  - `relayer.getTransaction()` - Get transaction status
  - `relayer.getTransactions()` - Get all user transactions
  - `relayer.getRelayerAddress()` - Get relayer's address
  - `relayer.getNonce()` - Get current nonce

- **Complete Documentation Suite**
  - `GUIDE_FOR_NEWBIES.md` - 500+ line comprehensive beginner's guide
  - `QUICK_START.md` - Quick reference for getting started
  - `RELAYER_IMPLEMENTATION.md` - Technical details of relayer implementation
  - `RELEASE_GUIDE.md` - How to create GitHub releases
  - `VERSION_COMPARISON.md` - Version comparison and merge guide
  - `COMPLETE_UPGRADE_GUIDE.md` - Step-by-step upgrade instructions
  - Updated README with trading & relayer sections
  - Comprehensive FAQ addressing common questions

- **New Examples**
  - `examples/trading-example.ts` - Complete trading workflow demonstration
  - `examples/relayer-example.ts` - Gasless transaction example

- **New Dependencies**
  - `@polymarket/clob-client@^4.22.8` - Official CLOB trading client
  - `@polymarket/relayer-client@^2.0.2` - Official relayer client
  - `ethers@^5.7.2` - Ethereum wallet and signing utilities

- **Enhanced Type System**
  - `TradingConfig` - Trading configuration interface
  - `RelayerConfig` - Relayer configuration interface
  - `PlaceOrderParams` - Order placement parameters
  - `Order` - Order representation interface
  - `BuilderConfig` - Builder attribution configuration
  - `RelayerTransactionResponse` - Relayer transaction response

### Changed
- Package version bumped to 0.4.0
- Updated package description to highlight trading capabilities
- Enhanced main SDK class with trading and relayer namespaces
- Improved documentation structure and completeness

### Fixed
- Proper version management with git tags
- Complete CHANGELOG documentation
- Comprehensive API documentation

### Breaking Changes
None! This release is fully backward compatible with v0.3.0.

## [0.3.0] - 2026-01-01

### Changed
- Version bump from 0.2.2 to 0.3.0
- (Original changelog entries were not documented)

## [0.2.2] - 2026-01-01

### Fixed
- Bug fixes and improvements
- (Original changelog entries were not documented)

## [0.2.1] - 2026-01-01

### Fixed
- Bug fixes and improvements
- (Original changelog entries were not documented)

## [0.2.0] - 2026-01-01

### Added
- New features added in v0.2.0
- Beta version 0.2.0-beta.0 released same day
- (Original changelog entries were not documented)

## [0.1.0] - 2026-12-01

### Added
- Initial release of POLYVANERA SDK
- `POLYVANERASDK` class for interacting with Polymarket data
- `getMarkets()` method to fetch all active markets
- `getMarket(marketId)` method to fetch individual market details
- `onOrderbook()` method for real-time orderbook streaming via WebSocket
- Full TypeScript support with comprehensive type definitions
- Built-in retry logic for HTTP requests with exponential backoff
- Custom error classes (`POLYVANERAError`, `HttpError`)
- Debug logging support
- Complete API documentation and examples
- Example scripts for listing markets and streaming orderbook data

### Features
- 🚀 Fetch live market data from Polymarket
- 📊 Subscribe to real-time orderbook updates
- 🔒 Type-safe with full TypeScript support
- 🪶 Lightweight with minimal dependencies
- 🎯 Developer-friendly API

### Documentation
- Comprehensive README with installation and usage instructions
- JSDoc comments throughout the codebase
- Example scripts demonstrating key functionality
- Type definitions for all public APIs


