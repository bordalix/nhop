/**
 * Default relays
 */
const defaultRelays = [
  'wss://nos.lol',
  'wss://nostr.wine',
  'wss://purplepag.es',
  'wss://relay.damus.io',
  'wss://eden.nostr.land',
  'wss://relay.nos.social',
  'wss://relay.primal.net',
  'wss://relay.noswhere.com',
  'wss://relay.snort.social',
]

/**
 * Relay merging utility
 * @param relays extracted from nevent, naddr, nprofile
 * @returns merged relays array
 */
export const mergeRelays = (relays: string[]): string[] => {
  const clean = (a: string[]) => a.map((r) => r.replace(/\/+$/, ''))
  return Array.from(new Set([...clean(defaultRelays), ...clean(relays)]))
}
