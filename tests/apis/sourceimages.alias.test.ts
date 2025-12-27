import { rokka } from '../mockServer'
import nock from 'nock'

describe('sourceimages.alias', () => {
  afterEach(() => {
    nock.cleanAll()
  })

  describe('alias.create', () => {
    it('creates an alias for a source image', async () => {
      nock('https://api.rokka.io')
        .put('/sourceimages/myorg/alias/my-alias', { hash: 'abc123def456' })
        .reply(200, {
          alias: 'my-alias',
          hash: 'abc123def456',
          organization: 'myorg',
        })

      const resp = await rokka().sourceimages.alias.create(
        'myorg',
        'my-alias',
        {
          hash: 'abc123def456',
        },
      )

      expect(resp.body.alias).toBe('my-alias')
      expect(resp.body.hash).toBe('abc123def456')
    })

    it('creates an alias with overwrite option', async () => {
      nock('https://api.rokka.io')
        .put('/sourceimages/myorg/alias/my-alias', { hash: 'newHash789' })
        .query({ overwrite: true })
        .reply(200, {
          alias: 'my-alias',
          hash: 'newHash789',
        })

      const resp = await rokka().sourceimages.alias.create(
        'myorg',
        'my-alias',
        { hash: 'newHash789' },
        { overwrite: true },
      )

      expect(resp.body.hash).toBe('newHash789')
    })

    it('returns error when alias exists and overwrite is false', async () => {
      nock('https://api.rokka.io')
        .put('/sourceimages/myorg/alias/existing-alias')
        .query({ overwrite: false })
        .reply(409, {
          error: { message: 'Alias already exists' },
        })

      try {
        await rokka().sourceimages.alias.create(
          'myorg',
          'existing-alias',
          { hash: 'abc123' },
          { overwrite: false },
        )
        fail('Expected an error to be thrown')
      } catch (error: any) {
        expect(error.statusCode).toBe(409)
      }
    })
  })

  describe('alias.get', () => {
    it('gets an alias', async () => {
      nock('https://api.rokka.io')
        .get('/sourceimages/myorg/alias/my-alias')
        .reply(200, {
          alias: 'my-alias',
          hash: 'abc123def456',
          organization: 'myorg',
          created: '2024-01-15T10:30:00+00:00',
        })

      const resp = await rokka().sourceimages.alias.get('myorg', 'my-alias')

      expect(resp.body.alias).toBe('my-alias')
      expect(resp.body.hash).toBe('abc123def456')
      expect(resp.body.created).toBe('2024-01-15T10:30:00+00:00')
    })

    it('handles not found error', async () => {
      nock('https://api.rokka.io')
        .get('/sourceimages/myorg/alias/nonexistent')
        .reply(404, {
          error: { message: 'Alias not found' },
        })

      try {
        await rokka().sourceimages.alias.get('myorg', 'nonexistent')
        fail('Expected an error to be thrown')
      } catch (error: any) {
        expect(error.statusCode).toBe(404)
      }
    })
  })

  describe('alias.delete', () => {
    it('deletes an alias', async () => {
      nock('https://api.rokka.io')
        .delete('/sourceimages/myorg/alias/my-alias')
        .reply(204)

      const resp = await rokka().sourceimages.alias.delete('myorg', 'my-alias')

      expect(resp.statusCode).toBe(204)
    })

    it('handles delete of nonexistent alias', async () => {
      nock('https://api.rokka.io')
        .delete('/sourceimages/myorg/alias/nonexistent')
        .reply(404, {
          error: { message: 'Alias not found' },
        })

      try {
        await rokka().sourceimages.alias.delete('myorg', 'nonexistent')
        fail('Expected an error to be thrown')
      } catch (error: any) {
        expect(error.statusCode).toBe(404)
      }
    })
  })

  describe('alias.invalidateCache', () => {
    it('invalidates cache for an alias', async () => {
      nock('https://api.rokka.io')
        .delete('/sourceimages/myorg/alias/my-alias/cache')
        .reply(200, {})

      const resp = await rokka().sourceimages.alias.invalidateCache(
        'myorg',
        'my-alias',
      )

      expect(resp.statusCode).toBe(200)
    })
  })
})
