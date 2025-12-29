import type { Query } from './query'
import { mergeRelays } from './relays'
import { SimplePool } from 'nostr-tools'
import type { UserContent } from './types'
import type { Filter, NostrEvent } from 'nostr-tools'

export class Fetcher {
  query: Query
  relays: string[] // can be populated from naddr, nprofile, nevent

  constructor(query: Query) {
    this.query = query
    this.relays = query.relays
  }

  async fetchNote(): Promise<NostrEvent> {
    const id = this.query.hex
    if (!id) throw new Error('Could not get event id')
    return await this.fetchEvent({ ids: [id] })
  }

  async fetchUser(): Promise<{ user: UserContent }> {
    const npub = this.query.hex
    if (!npub) throw new Error('Could not derive npub')
    // fetch user metadata
    const userEvent = await this.fetchEvent({ kinds: [0], authors: [npub] })
    if (!userEvent) throw new Error('No user event found')
    const user = JSON.parse(userEvent.content) as UserContent
    // fetch user relays
    const relaysEvent = await this.fetchEvent({
      kinds: [10002],
      authors: [npub],
    })
    user.relays = relaysEvent ? relaysEvent.tags.filter((t) => t[0] === 'r').map((t) => t[1]) : []
    this.relays = [...this.query.relays, ...user.relays] // we could have relays extracted before
    // fetch latest notes from user
    const noteEvents = await this.fetchEvents({
      authors: [npub],
      kinds: [1],
      limit: 5,
    })
    user.notes = noteEvents
    return { user }
  }

  async fetchEvent(filter: Filter): Promise<NostrEvent> {
    filter.limit = 1
    const events = await this.fetchEvents(filter)
    if (events.length === 0) throw new Error('No events found')
    return events[0]
  }

  async fetchEvents(filter: Filter): Promise<NostrEvent[]> {
    const pool = new SimplePool()
    const relays = mergeRelays(this.relays) // merge with default relays
    return await pool.querySync(relays, filter)
  }
}

export const fetchNIP05Profile = async (pubkey: string): Promise<{ npub: string; relays: string[] }> => {
  if (!/^.+@.+$/.test(pubkey)) throw new Error('Invalid NIP-05 format')
  const [name, domain] = pubkey.split('@')
  const url = `https://${domain}/.well-known/nostr.json?name=${name}`
  const res = await fetch(url)
  const data = (await res.json()) as {
    names: Record<string, string>
    relays?: Record<string, string[]>
  }
  if (!data.names[name]) throw new Error('NIP-05 profile not found')
  const npub = data.names[name]
  const relays = data.relays?.[npub] || []
  return { npub, relays }
}
