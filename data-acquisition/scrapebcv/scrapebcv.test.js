import { describe, expect, it } from 'vitest'

// The two tests marked with concurrent will be run in parallel
describe('suite', () => {
  it('serial test', async () => {
    expect(2 + 2).toBe(4)
  })
})
