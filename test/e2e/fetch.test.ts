import { describe, expect, test, vi } from 'vitest'
import { Fetcher, fetchNIP05Profile } from '../../src/fetch'
import { Query } from '../../src/query'
import { naddrEncode, neventEncode, noteEncode, nprofileEncode, npubEncode } from 'nostr-tools/nip19'

describe('fetch tests', () => {
  const name = 'bordalix'
  const lud16 = 'bordalix@coinos.io'
  const nip05 = 'bordalix@joaobordalo.com'
  const pubkey = '62cef883863022a4f1d60d54857c9d729650702c9fe227b0988c0b6e36c4bcce'
  const event = {
    id: '28fe8f39c947f1f873714dfbde87fcdc2582f59e9bb5528d6588681d99e9210c',
    created_at: 1752179889,
    kind: 1,
    pubkey,
  }

  vi.setConfig({ testTimeout: 15000 })

  describe('fetchNIP05Profile', () => {
    test('should fetch nip05 profile', async () => {
      const result = await fetchNIP05Profile(nip05)
      expect(result.pubkey).toBe(pubkey)
      expect(result.relays).toEqual([])
    })

    test('should throw error on invalid nip05 format', async () => {
      await expect(fetchNIP05Profile('invalidnip05')).rejects.toThrow()
    })

    test('should throw error on non existing nip05 profile', async () => {
      await expect(fetchNIP05Profile('nonexistent@domain.com')).rejects.toThrow()
    })
  })

  describe('fetchUser', () => {
    test('should fetch naddr', async () => {
      const naddr = naddrEncode({ pubkey, kind: 1, identifier: 'test' })
      const query = await Query.create(naddr)
      const fetcher = new Fetcher(query)
      const result = await fetcher.fetchUser()
      expect(result.user).toBeDefined()
      expect(result.user.name).toBe(name)
      expect(result.user.lud16).toBe(lud16)
      expect(result.user.nip05).toBe(nip05)
      expect(result.user.relays?.length).toBeGreaterThan(0)
      expect(result.user.notes?.length).toBeGreaterThan(0)
    })

    test('should fetch nprofile', async () => {
      const nprofile = nprofileEncode({ pubkey })
      const query = await Query.create(nprofile)
      const fetcher = new Fetcher(query)
      const result = await fetcher.fetchUser()
      expect(result.user).toBeDefined()
      expect(result.user.name).toBe(name)
      expect(result.user.lud16).toBe(lud16)
      expect(result.user.nip05).toBe(nip05)
      expect(result.user.relays?.length).toBeGreaterThan(0)
      expect(result.user.notes?.length).toBeGreaterThan(0)
    })

    test('should fetch npub', async () => {
      const npub = npubEncode(pubkey)
      const query = await Query.create(npub)
      const fetcher = new Fetcher(query)
      const result = await fetcher.fetchUser()
      expect(result.user).toBeDefined()
      expect(result.user.name).toBe(name)
      expect(result.user.lud16).toBe(lud16)
      expect(result.user.nip05).toBe(nip05)
      expect(result.user.relays?.length).toBeGreaterThan(0)
      expect(result.user.notes?.length).toBeGreaterThan(0)
    })
  })

  describe('fetchNote', () => {
    test('should fetch note', async () => {
      const note = noteEncode(event.id)
      const query = await Query.create(note)
      const fetcher = new Fetcher(query)
      const result = await fetcher.fetchNote()
      expect(result.id).toBe(event.id)
      expect(result.kind).toBe(event.kind)
      expect(result.pubkey).toBe(event.pubkey)
      expect(result.created_at).toBe(event.created_at)
    })

    test('should fetch nevent', async () => {
      const nevent = neventEncode({ id: event.id })
      const query = await Query.create(nevent)
      const fetcher = new Fetcher(query)
      const result = await fetcher.fetchNote()
      expect(result.id).toBe(event.id)
      expect(result.kind).toBe(event.kind)
      expect(result.pubkey).toBe(event.pubkey)
      expect(result.created_at).toBe(event.created_at)
    })
  })
})
