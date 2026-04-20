import { HttpError } from "./errors.js";

/**
 * Fetch JSON data from a URL with error handling.
 * 
 * @param url - The URL to fetch from
 * @param init - Optional fetch init options
 * @returns Promise resolving to the parsed JSON response
 * @throws {HttpError} If the response is not ok
 */
export async function getJson<T = unknown>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, { ...init, method: init?.method ?? "GET" });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new HttpError(res.status, `GET ${url} failed: ${res.status} ${text || res.statusText}`);
  }
  return res.json() as Promise<T>;
}
