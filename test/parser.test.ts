import { generateSecretKey, getPublicKey } from 'nostr-tools'
import { parseNip19 } from '../src/parser'
import { describe, expect, test } from 'vitest'
import { naddrEncode, neventEncode, nprofileEncode, npubEncode, nsecEncode } from 'nostr-tools/nip19'

describe('parser tests', () => {
  const id = getPublicKey(generateSecretKey())
  const sk = generateSecretKey()
  const pk = getPublicKey(sk)
  const npub = npubEncode(pk)
  const nsec = nsecEncode(sk)
  const relays = ['wss://relay.nostr.example.mydomain.example.com', 'wss://nostr.banana.com']

  describe('invalid input', () => {
    test('should return empty hex and relays for invalid input', () => {
      const result = parseNip19('invalidinput')
      expect(result.hex).toBe('')
      expect(result.relays).toEqual([])
    })

    test('should return empty hex and relays for empty input', () => {
      const result = parseNip19('')
      expect(result.hex).toBe('')
      expect(result.relays).toEqual([])
    })
  })

  describe('naddr', () => {
    test('should parse naddr input correctly', () => {
      const naddr = naddrEncode({
        relays,
        pubkey: pk,
        kind: 30023,
        identifier: 'banana',
      })
      const result = parseNip19(naddr)
      expect(result.hex).toBe(pk)
      expect(result.relays).toEqual(relays)
    })

    test('should parse naddr input without relays correctly', () => {
      const naddr = naddrEncode({
        pubkey: pk,
        kind: 30023,
        identifier: 'banana',
      })
      const result = parseNip19(naddr)
      expect(result.hex).toBe(pk)
      expect(result.relays).toEqual([])
    })

    test('should parse naddr from habla.news', () => {
      const naddr = 'naddr1qq98yetxv4ex2mnrv4esygrl54h466tz4v0re4pyuavvxqptsejl0vxcmnhfl60z3rth2xkpjspsgqqqw4rsf34vl5'
      const pubkey = '7fa56f5d6962ab1e3cd424e758c3002b8665f7b0d8dcee9fe9e288d7751ac194'
      const result = parseNip19(naddr)
      expect(result.hex).toBe(pubkey)
      expect(result.relays).toEqual([])
    })

    test('should parse naddr from go-nostr with different TLV ordering', () => {
      const naddr =
        'naddr1qqrxyctwv9hxzq3q80cvv07tjdrrgpa0j7j7tmnyl2yr6yr7l8j4s3evf6u64th6gkwsxpqqqp65wqfwwaehxw309aex2mrp0yhxummnw3ezuetcv9khqmr99ekhjer0d4skjm3wv4uxzmtsd3jjucm0d5q3vamnwvaz7tmwdaehgu3wvfskuctwvyhxxmmd0zfmwx'
      const pubkey = '3bf0c63fcb93463407af97a5e5ee64fa883d107ef9e558472c4eb9aaaefa459d'
      const result = parseNip19(naddr)
      expect(result.hex).toBe(pubkey)
      expect(result.relays).toEqual(relays)
    })

    test('should throw on invalid naddr input', () => {
      expect(() => parseNip19('naddr1jz5mdl')).toThrow()
    })
  })

  describe('nevent', () => {
    test('should parse nevent input correctly', () => {
      const naddr = neventEncode({
        id,
        relays,
        kind: 30023,
      })
      const result = parseNip19(naddr)
      expect(result.hex).toBe(id)
      expect(result.relays).toEqual(relays)
    })

    test('should parse nevent input with kind 0 correctly', () => {
      const naddr = neventEncode({
        id,
        relays,
        kind: 0,
      })
      const result = parseNip19(naddr)
      expect(result.hex).toBe(id)
      expect(result.relays).toEqual(relays)
    })

    test('should parse nevent input without relays correctly', () => {
      const naddr = neventEncode({
        id,
        kind: 30023,
      })
      const result = parseNip19(naddr)
      expect(result.hex).toBe(id)
      expect(result.relays).toEqual([])
    })

    test('should throw on invalid nevent input', () => {
      expect(() => parseNip19('nevent1jz5mdl')).toThrow()
    })
  })

  describe('note', () => {
    test('should parse note input correctly', () => {
      const note = 'note1gmtnz6q2m55epmlpe3semjdcq987av3jvx4emmjsa8g3s9x7tg4sclreky'
      const id = '46d731680add2990efe1cc619dc9b8014feeb23261ab9dee50e9d11814de5a2b'
      const result = parseNip19(note)
      expect(result.hex).toBe(id)
      expect(result.relays).toEqual([])
    })

    test('should throw on invalid note input', () => {
      expect(() => parseNip19('note1jz5mdl')).toThrow()
    })
  })

  describe('nprofile', () => {
    test('should parse nprofile input correctly', () => {
      const nprofile = nprofileEncode({ pubkey: pk, relays })
      const result = parseNip19(nprofile)
      expect(result.hex).toBe(pk)
      expect(result.relays).toEqual(relays)
    })

    test('should parse nprofile input without relays correctly', () => {
      const nprofile = nprofileEncode({ pubkey: pk, relays: [] })
      const result = parseNip19(nprofile)
      expect(result.hex).toBe(pk)
      expect(result.relays).toEqual([])
    })

    test('should throw on invalid nprofile input', () => {
      expect(() => parseNip19('nprofile1jz5mdl')).toThrow()
    })
  })

  describe('npub', () => {
    test('should parse npub input correctly', () => {
      const result = parseNip19(npub)
      expect(result.hex).toBe(pk)
      expect(result.relays).toEqual([])
    })

    test('should throw on invalid npub input', () => {
      expect(() => parseNip19('npub1jz5mdl')).toThrow()
    })
  })

  describe('nsec', () => {
    test('should parse nsec input correctly', () => {
      const result = parseNip19(nsec)
      expect(result.hex).toBe(pk)
      expect(result.relays).toEqual([])
    })

    test('should throw on invalid nsec input', () => {
      expect(() => parseNip19('nsec1jz5mdl')).toThrow()
    })
  })
})
