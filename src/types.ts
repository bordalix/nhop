import type { NostrEvent } from 'nostr-tools'

export const userPrefixes = ['nsec', 'npub', 'nprofile']
export const notePrefixes = ['nevent', 'note']
export const suppPrefixes = [...userPrefixes, ...notePrefixes]

export const relays = [
  'wss://nos.lol',
  'wss://relay.damus.io',
  'wss://relay.primal.net',
  'wss://relay.noswhere.com',
  'wss://relay.bitcoinpark.com',
]

export interface UserContent {
  about?: string
  banner?: string
  created_at?: string
  displayName?: string
  lud16?: string
  name?: string
  notes?: NostrEvent[]
  npub?: string
  picture?: string
  pubkey?: string
  relays?: string[]
  username?: string
  website?: string
}
