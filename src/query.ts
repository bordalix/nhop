import { nip19 } from 'nostr-tools'
import { notePrefixes, suppPrefixes, userPrefixes } from './types'
import { fetchNIP05Profile } from './fetch'

export class Query {
  error: string
  input: string
  prefix: string
  isNote: boolean
  isUser: boolean

  constructor(
    error: string,
    input: string,
    prefix: string,
    isNote: boolean,
    isUser: boolean
  ) {
    this.error = error
    this.input = input
    this.prefix = prefix
    this.isNote = isNote
    this.isUser = isUser
  }

  static async create(input: string): Promise<Query> {
    let error = ''
    // clean input
    input = input.replace('?', '')
    // convert hex to note
    if (/^[0-9a-fA-F]{64}$/.test(input)) {
      input = nip19.noteEncode(input)
    }
    // resolve nip05 to npub
    if (/^.+@.+$/.test(input)) {
      const npub = await fetchNIP05Profile(input)
      if (npub) input = nip19.npubEncode(npub)
    }
    // validate prefix
    const prefix = input.match(/^(n[A-Za-z]+)1/)?.[1] || ''
    if (!suppPrefixes.includes(prefix)) error = 'Invalid prefix'
    // check type
    const isNote = notePrefixes.includes(prefix)
    const isUser = userPrefixes.includes(prefix)
    // validate nip19 decoding
    try {
      nip19.decode(input)
    } catch (e) {
      error = e instanceof Error ? e.message : 'Invalid key'
    }
    return new Query(error, input, prefix, isNote, isUser)
  }
}
