import { getJson } from "../http.js";
import type { Market } from "../types.js";

/**
 * Fetch a list of Polymarket markets.
 * Adjust the endpoint/shape to your preferred metadata source if needed.
 */
export async function pmFetchMarkets(metaBaseUrl: string): Promise<Market[]> {
  const url = `${metaBaseUrl}/markets`;
  const raw = await getJson<any[]>(url);

  return raw.map((m) => ({
    id: String(m.id ?? m.marketId ?? m.slug ?? ""),
    question: String(m.question ?? m.title ?? m.ticker ?? "Unknown"),
    outcomes: Array.isArray(m.outcomes) ? m.outcomes.map(String) :
      (m.outcomes?.split?.("|") ?? ["YES", "NO"]),
    status: (m.status ?? "open") as Market["status"],
    prices: m.prices ?? undefined,
    volumeUsd: Number(m.volumeUsd ?? m.volume ?? 0),
    liquidityUsd: Number(m.liquidityUsd ?? m.liquidity ?? 0),
    raw: m
  }));
}

export async function pmFetchMarket(metaBaseUrl: string, marketId: string): Promise<Market> {
  const url = `${metaBaseUrl}/markets/${encodeURIComponent(marketId)}`;
  const m = await getJson<any>(url);

  return {
    id: String(m.id ?? m.marketId ?? marketId),
    question: String(m.question ?? m.title ?? "Unknown"),
    outcomes: Array.isArray(m.outcomes) ? m.outcomes.map(String) :
      (m.outcomes?.split?.("|") ?? ["YES", "NO"]),
    status: (m.status ?? "open") as Market["status"],
    prices: m.prices ?? undefined,
    volumeUsd: Number(m.volumeUsd ?? m.volume ?? 0),
    liquidityUsd: Number(m.liquidityUsd ?? m.liquidity ?? 0),
    raw: m
  };
}
