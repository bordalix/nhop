import { describe, expect, test } from 'vitest'
import { mergeRelays } from '../src/relays'

describe('relays tests', () => {
  const defaultRelays = mergeRelays([])

  test('should add to list of default relays', () => {
    const merged = mergeRelays(['wss://custom.relay'])
    expect(merged.length).toBe(defaultRelays.length + 1)
    expect(merged).toContain('wss://custom.relay')
  })

  test('should not add duplicates', () => {
    const dup = defaultRelays[0]
    const merged = mergeRelays([dup])
    expect(merged.length).toBe(defaultRelays.length)
  })

  test('should clean trailing slashes', () => {
    const relayWithSlash = defaultRelays[0] + '/'
    const merged = mergeRelays([relayWithSlash])
    expect(merged.length).toBe(defaultRelays.length)
  })
})
