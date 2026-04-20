import { POLYVANERASDK } from "../src/client.js";

// In Node: `npm i ws` then:
// // @ts-ignore
// globalThis.WebSocket = (await import("ws")).default as any;

async function main() {
  const sdk = new POLYVANERASDK({ debug: true });
  const marketId = process.env.POLYVANERA_MARKET_ID || "example-market-id";

  const off = sdk.onOrderbook(
    marketId,
    (u) => {
      if (u.type === "snapshot") {
        console.log("Best bid/ask:",
          u.data.bids[0]?.price, u.data.asks[0]?.price
        );
      } else {
        console.log("Delta:", u.data);
      }
    },
    {
      onOpen: () => console.log("WS open"),
      onClose: () => console.log("WS closed"),
      onError: (e) => console.error("WS error", e)
    }
  );

  setTimeout(() => {
    off();
    process.exit(0);
  }, 15000);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
