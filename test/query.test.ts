import { generateSecretKey, getPublicKey } from 'nostr-tools'
import { Query } from '../src/query'
import { describe, expect, test } from 'vitest'
import { naddrEncode, neventEncode, noteEncode, nprofileEncode, npubEncode, nsecEncode } from 'nostr-tools/nip19'

describe('query tests', () => {
  const id = getPublicKey(generateSecretKey())
  const sk = generateSecretKey()
  const pk = getPublicKey(sk)
  const npub = npubEncode(pk)
  const nsec = nsecEncode(sk)
  const relays = ['wss://relay.nostr.example.mydomain.example.com', 'wss://nostr.banana.com']

  describe('naddr', () => {
    test('should initialize correctly with naddr input', async () => {
      const naddr = naddrEncode({ pubkey: pk, kind: 1, identifier: 'test', relays })
      const query = await Query.create(naddr)
      expect(query.relays).toEqual(relays)
      expect(query.error).toBe('')
      expect(query.hex).toBe(pk)
    })

    test('should have error on invalid naddr input', async () => {
      const query = await Query.create('naddr1jz5mdl')
      expect(query.error).not.toBe('')
    })
  })

  describe('nevent', () => {
    test('should initialize correctly with nevent input', async () => {
      const nevent = neventEncode({ id, kind: 1, relays })
      const query = await Query.create(nevent)
      expect(query.relays).toEqual(relays)
      expect(query.error).toBe('')
      expect(query.hex).toBe(id)
    })

    test('should initialize correctly with nevent input without relays', async () => {
      const nevent = neventEncode({ id, kind: 1 })
      const query = await Query.create(nevent)
      expect(query.relays).toEqual([])
      expect(query.error).toBe('')
      expect(query.hex).toBe(id)
    })

    test('should have error on invalid nevent input', async () => {
      const query = await Query.create('nevent1jz5mdl')
      expect(query.error).not.toBe('')
    })
  })

  describe('note', () => {
    test('should initialize correctly with note input', async () => {
      const note = noteEncode(id)
      const query = await Query.create(note)
      expect(query.relays).toEqual([])
      expect(query.error).toBe('')
      expect(query.hex).toBe(id)
    })

    test('should have error on invalid note input', async () => {
      const query = await Query.create('note1jz5mdl')
      expect(query.error).not.toBe('')
    })
  })

  describe('nprofile', () => {
    test('should initialize correctly with nprofile input', async () => {
      const nprofile = nprofileEncode({ pubkey: pk, relays })
      const query = await Query.create(nprofile)
      expect(query.relays).toEqual(relays)
      expect(query.error).toBe('')
      expect(query.hex).toBe(pk)
    })

    test('should initialize correctly with nprofile input without relays', async () => {
      const nprofile = nprofileEncode({ pubkey: pk, relays: [] })
      const query = await Query.create(nprofile)
      expect(query.relays).toEqual([])
      expect(query.error).toBe('')
      expect(query.hex).toBe(pk)
    })

    test('should have error on invalid nprofile input', async () => {
      const query = await Query.create('nprofile1jz5mdl')
      expect(query.error).not.toBe('')
    })
  })

  describe('npub', () => {
    test('should initialize correctly with npub input', async () => {
      const query = await Query.create(npub)
      expect(query.relays).toEqual([])
      expect(query.error).toBe('')
      expect(query.hex).toBe(pk)
    })

    test('should have error on invalid npub input', async () => {
      const query = await Query.create('npub1jz5mdl')
      expect(query.error).not.toBe('')
    })
  })

  describe('nsec', () => {
    test('should initialize correctly with nsec input', async () => {
      const query = await Query.create(nsec)
      expect(query.relays).toEqual([])
      expect(query.error).toBe('')
      expect(query.hex).toBe(pk)
    })

    test('should have error on invalid nsec input', async () => {
      const query = await Query.create('nsec1jz5mdl')
      expect(query.error).not.toBe('')
    })
  })
})
