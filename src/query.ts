import { nip19 } from 'nostr-tools'
import { notePrefixes, suppPrefixes, userPrefixes } from './types'

export class Query {
  input: string

  constructor(input: string) {
    this.input = input.replace('?', '')
    // auto-convert hex note id to note format
    if (/^[0-9a-fA-F]{64}$/.test(this.input)) {
      this.input = nip19.noteEncode(this.input)
    }
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
