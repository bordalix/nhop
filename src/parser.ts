import { getPublicKey, nip19 } from 'nostr-tools'

export const parseNip19 = (input: string): { hex: string; relays: string[] } => {
  let hex = ''
  let relays: string[] = []
  if (input.startsWith('nevent1')) {
    const nevent = nip19.decode(input) as nip19.DecodedNevent
    if (nevent.type !== 'nevent') throw new Error('Invalid nevent')
    if (!nevent.data?.id) throw new Error('Invalid nevent data')
    relays = nevent.data?.relays || []
    hex = nevent.data.id
  }
  if (input.startsWith('note1')) {
    const noteDecoded = nip19.decode(input) as nip19.DecodedNote
    if (noteDecoded.type !== 'note') throw new Error('Invalid note')
    if (!noteDecoded.data) throw new Error('Invalid note data')
    hex = noteDecoded.data
  }
  if (input.startsWith('naddr1')) {
    const naddr = nip19.decode(input) as nip19.DecodedNaddr
    if (naddr.type !== 'naddr') throw new Error('Invalid naddr')
    if (!naddr.data?.pubkey) throw new Error('Invalid naddr data')
    relays = naddr.data?.relays || []
    hex = naddr.data.pubkey
  }
  if (input.startsWith('nsec1')) {
    const nsec = nip19.decode(input) as nip19.DecodedNsec
    if (nsec.type !== 'nsec') throw new Error('Invalid nsec')
    if (!nsec.data) throw new Error('Invalid nsec data')
    hex = getPublicKey(nsec.data)
  }
  if (input.startsWith('nprofile1')) {
    const nprofile = nip19.decode(input) as nip19.DecodedNprofile
    if (nprofile.type !== 'nprofile') throw new Error('Invalid nprofile')
    if (!nprofile.data?.pubkey) throw new Error('Invalid nprofile data')
    relays = nprofile.data?.relays || []
    hex = nprofile.data.pubkey
  }
  if (input.startsWith('npub1')) {
    const npubDecoded = nip19.decode(input) as nip19.DecodedNpub
    if (npubDecoded.type !== 'npub') throw new Error('Invalid npub')
    if (!npubDecoded.data) throw new Error('Invalid npub data')
    hex = npubDecoded.data
  }
  return { hex, relays }
}
