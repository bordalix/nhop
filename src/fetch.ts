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
    const pubkey = this.query.hex
    if (!pubkey) throw new Error('Could not derive pubkey')
    // fetch user metadata
    const userEvent = await this.fetchEvent({ kinds: [0], authors: [pubkey] })
    if (!userEvent) throw new Error('No user event found')
    let user: UserContent
    try {
      user = JSON.parse(userEvent.content) as UserContent
    } catch (error) {
      throw new Error(`Failed to parse user metadata: ${error instanceof Error ? error.message : 'Invalid JSON'}`)
    }
    // fetch user relays
    const relaysEvent = await this.fetchEvent({
      kinds: [10002],
      authors: [pubkey],
    })
    user.relays = relaysEvent ? relaysEvent.tags.filter((t) => t[0] === 'r').map((t) => t[1]) : []
    this.relays = [...this.query.relays, ...user.relays] // we could have relays extracted before
    // fetch latest notes from user
    const noteEvents = await this.fetchEvents({
      authors: [pubkey],
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

export const fetchNIP05Profile = async (nip05: string): Promise<{ pubkey: string; relays: string[] }> => {
  if (!/^.+@.+$/.test(nip05)) throw new Error('Invalid NIP-05 format')
  const [name, domain] = nip05.split('@')
  const url = `https://${domain}/.well-known/nostr.json?name=${name}`
  let data: { names: Record<string, string>; relays?: Record<string, string[]> }
  try {
    const res = await fetch(url)
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`)
    data = await res.json()
  } catch (error) {
    throw new Error(`Failed to fetch NIP-05 profile: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
  if (!data.names[name]) throw new Error('NIP-05 profile not found')
  const pubkey = data.names[name]
  const relays = data.relays?.[pubkey] || []
  return { pubkey, relays }
}
