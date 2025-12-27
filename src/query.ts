import { nip19 } from 'nostr-tools'
import { notePrefixes, suppPrefixes, userPrefixes } from './types'
import { fetchNIP05Profile } from './fetch'

export class Query {
  input: string

  constructor(input: string) {
    this.input = input
  }

  static async create(input: string): Promise<Query> {
    input = input.replace('?', '')
    if (/^[0-9a-fA-F]{64}$/.test(input)) {
      input = nip19.noteEncode(input)
    }
    if (/^.+@.+$/.test(input)) {
      const npub = await fetchNIP05Profile(input)
      if (npub) input = nip19.npubEncode(npub)
    }
    return new Query(input)
  }

  error(): string | undefined {
    if (this.isTooShort()) return 'Too short'
    if (!this.validPrefix()) return 'Invalid prefix'
    return undefined
  }

  getPrefix(): string {
    return this.input.match(/^(n[A-Za-z]+)1/)?.[1] || ''
  }

  isNote(): boolean {
    return notePrefixes.includes(this.getPrefix())
  }

  isTooShort(): boolean {
    return this.input.length < 21
  }

  isValid(): boolean {
    return this.error() === undefined
  }

  isUser(): boolean {
    return userPrefixes.includes(this.getPrefix())
  }

  validPrefix(): boolean {
    return suppPrefixes.includes(this.getPrefix())
  }
}
