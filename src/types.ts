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

export const clients: { name: string; url: string }[] = [
  {
    name: 'Amethyst',
    url: 'https://amethyst.nostr.build',
  },
  {
    name: 'Coracle',
    url: 'https://coracle.social',
  },
  {
    name: 'Damus',
    url: 'https://damus.io',
  },
  {
    name: 'Iris',
    url: 'https://iris.to',
  },
  {
    name: 'Jumble',
    url: 'https://jumble.social',
  },
  {
    name: 'Nosotros',
    url: 'https://nosotros.app',
  },
  {
    name: 'Nosta',
    url: 'https://nosta.me',
  },
  {
    name: 'NostrChat',
    url: 'https://nostrchat.com',
  },
  {
    name: 'Nostrudel',
    url: 'https://nostrudel.ninja',
  },
  {
    name: 'Nostter',
    url: 'https://nostter.app',
  },
  {
    name: 'Phoenix',
    url: 'https://phoenix.social',
  },
  {
    name: 'Primal',
    url: 'https://primal.net',
  },
  {
    name: 'Snort',
    url: 'https://snort.social',
  },
  {
    name: 'YakiHonne',
    url: 'https://yakihonne.com',
  },
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
