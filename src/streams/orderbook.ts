import type { OrderbookSnapshot, OrderbookUpdate } from "../types.js";

/**
 * Subscribe to Polymarket orderbook via WebSocket.
 * In Node, install 'ws' and set: `globalThis.WebSocket = require('ws');`
 */
export function pmSubscribeOrderbook(
  wsBaseUrl: string,
  marketId: string,
  onUpdate: (u: OrderbookUpdate) => void,
  opts?: { onError?: (e: any) => void; onOpen?: () => void; onClose?: () => void }
): () => void {
  const WS: any = (globalThis as any).WebSocket;
  if (!WS) throw new Error("WebSocket not available. In Node, install 'ws' and assign to globalThis.WebSocket.");

  const url = `${wsBaseUrl}/orderbook/${encodeURIComponent(marketId)}`;
  const ws = new WS(url);

  ws.onopen = () => opts?.onOpen?.();
  ws.onerror = (e: any) => opts?.onError?.(e);
  ws.onclose = () => opts?.onClose?.();

  ws.onmessage = (evt: MessageEvent) => {
    try {
      const msg = JSON.parse((evt as any).data);
      if (msg?.type === "snapshot") {
        const snap: OrderbookSnapshot = {
          marketId,
          bids: (msg.bids ?? []).map((b: any) => ({ price: Number(b[0]), size: Number(b[1]) })),
          asks: (msg.asks ?? []).map((a: any) => ({ price: Number(a[0]), size: Number(a[1]) })),
          ts: Date.now()
        };
        onUpdate({ type: "snapshot", data: snap });
      } else {
        onUpdate({ type: "delta", data: { marketId, ...msg } });
      }
    } catch (e) {
      opts?.onError?.(e);
    }
  };

  return () => ws.close();
}
