import type { NostrEvent } from 'nostr-tools'

export const notePrefixes = ['nevent', 'note']
export const userPrefixes = ['naddr', 'nprofile', 'npub', 'nsec']
export const suppPrefixes = [...userPrefixes, ...notePrefixes]

export interface UserContent {
  about?: string
  banner?: string
  created_at?: string
  displayName?: string
  lud16?: string
  name?: string
  nip05?: string
  notes?: NostrEvent[]
  npub?: string
  picture?: string
  pubkey?: string
  relays?: string[]
  username?: string
  website?: string
}
