import { notePrefixes, suppPrefixes, userPrefixes } from './types'
import { fetchNIP05Profile } from './fetch'
import { parseNip19 } from './parser'
import { nip19 } from 'nostr-tools'

export class Query {
  hex: string
  error: string
  input: string
  prefix: string
  isNote: boolean
  isUser: boolean
  relays: string[]

  constructor(
    hex: string,
    error: string,
    input: string,
    prefix: string,
    isNote: boolean,
    isUser: boolean,
    relays: string[]
  ) {
    this.hex = hex
    this.error = error
    this.input = input
    this.prefix = prefix
    this.isNote = isNote
    this.isUser = isUser
    this.relays = relays
  }

  static async create(input: string): Promise<Query> {
    let hex = ''
    let error = ''
    let relays: string[] = []
    // clean input
    input = input.replace('?', '')
    // convert hex to note
    if (/^[0-9a-fA-F]{64}$/.test(input)) {
      input = nip19.noteEncode(input)
    }
    // resolve nip05 to npub
    if (/^.+@.+$/.test(input)) {
      const { pubkey, relays: nip5relays } = await fetchNIP05Profile(input)
      if (pubkey) input = nip19.npubEncode(pubkey)
      if (nip5relays) relays = nip5relays
    }
    // validate prefix
    const prefix = input.match(/^(n[A-Za-z]+)1/)?.[1] || ''
    if (!suppPrefixes.includes(prefix)) error = 'Invalid prefix'
    // check type
    const isNote = notePrefixes.includes(prefix)
    const isUser = userPrefixes.includes(prefix)
    // parse nip19
    try {
      const { hex: parsedHex, relays: parsedRelays } = parseNip19(input)
      relays = [...new Set([...relays, ...parsedRelays])]
      hex = parsedHex
    } catch (e) {
      error = e instanceof Error ? e.message : 'Invalid key'
    }
    // return query
    return new Query(hex, error, input, prefix, isNote, isUser, relays)
  }
}
