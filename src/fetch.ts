import {
  getPublicKey,
  nip19,
  SimplePool,
  type Filter,
  type NostrEvent,
} from 'nostr-tools'
import type { Query } from './query'
import { relays, type UserContent } from './types'

export class Fetcher {
  query: Query

  constructor(query: Query) {
    this.query = query
  }

  async fetchNote(): Promise<NostrEvent> {
    let id = ''
    if (this.query.getPrefix() === 'nevent') {
      const nevent = nip19.decode(this.query.input) as nip19.DecodedNevent
      if (nevent.type !== 'nevent') throw new Error('Invalid nevent')
      if (!nevent.data?.id) throw new Error('Invalid nevent data')
      id = nevent.data.id
    }
    if (this.query.getPrefix() === 'note') {
      const noteDecoded = nip19.decode(this.query.input) as nip19.DecodedNote
      if (noteDecoded.type !== 'note') throw new Error('Invalid note')
      if (!noteDecoded.data) throw new Error('Invalid note data')
      id = noteDecoded.data
    }
    if (!id) throw new Error('Could not get event id')
    return await this.fetchEvent({ ids: [id] })
  }

  async fetchUser(): Promise<{ user: UserContent }> {
    let npub = ''
    if (this.query.getPrefix() === 'naddr') {
      const naddr = nip19.decode(this.query.input) as nip19.DecodedNaddr
      if (naddr.type !== 'naddr') throw new Error('Invalid naddr')
      if (!naddr.data?.pubkey) throw new Error('Invalid naddr data')
      npub = naddr.data.pubkey
    }
    if (this.query.getPrefix() === 'nsec') {
      const nsec = nip19.decode(this.query.input) as nip19.DecodedNsec
      if (nsec.type !== 'nsec') throw new Error('Invalid nsec')
      if (!nsec.data) throw new Error('Invalid nsec data')
      npub = getPublicKey(nsec.data)
    }
    if (this.query.getPrefix() === 'nprofile') {
      const nprofile = nip19.decode(this.query.input) as nip19.DecodedNprofile
      if (nprofile.type !== 'nprofile') throw new Error('Invalid nprofile')
      if (!nprofile.data?.pubkey) throw new Error('Invalid nprofile data')
      npub = nprofile.data.pubkey
    }
    if (this.query.getPrefix() === 'npub') {
      const npubDecoded = nip19.decode(this.query.input) as nip19.DecodedNpub
      if (npubDecoded.type !== 'npub') throw new Error('Invalid npub')
      if (!npubDecoded.data) throw new Error('Invalid npub data')
      npub = npubDecoded.data
    }
    if (!npub) throw new Error('Could not derive npub')
    // fetch user metadata
    const userEvent = await this.fetchEvent({ kinds: [0], authors: [npub] })
    if (!userEvent) throw new Error('No user events found')
    const user: UserContent = JSON.parse(userEvent.content)
    // fetch user relays
    const relaysEvent = await this.fetchEvent({
      kinds: [10002],
      authors: [npub],
    })
    user.relays = relaysEvent
      ? relaysEvent.tags.filter((t) => t[0] === 'r').map((t) => t[1])
      : []
    // fetch latest notes
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
    return await pool.querySync(relays, filter)
  }
}

export const fetchNIP05Profile = async (pubkey: string): Promise<string> => {
  if (!/^.+@.+$/.test(pubkey)) return ''
  const [name, domain] = pubkey.split('@')
  const url = `https://${domain}/.well-known/nostr.json?name=${name}`
  const res = await fetch(url)
  const data = await res.json()
  if (!data || !data.names || !data.names[name]) return ''
  return data.names[name]
}
