import { rokka } from '../mockServer'
import nock from 'nock'

describe('utils', () => {
  describe('utils.signUrl', () => {
    it('signs a URL via the API', async () => {
      nock('https://api.rokka.io')
        .post('/utils/myorg/sign_url', {
          url: 'https://myorg.rokka.io/mystack/c421f4.jpg',
        })
        .reply(200, {
          signed_url:
            'https://myorg.rokka.io/mystack/c421f4.jpg?sig=abc123def456',
        })

      const resp = await rokka().utils.signUrl(
        'myorg',
        'https://myorg.rokka.io/mystack/c421f4.jpg',
      )

      expect(resp.body.signed_url).toBe(
        'https://myorg.rokka.io/mystack/c421f4.jpg?sig=abc123def456',
      )
    })

    it('signs a URL with roundDateUpTo option', async () => {
      nock('https://api.rokka.io')
        .post('/utils/myorg/sign_url', {
          url: 'https://myorg.rokka.io/mystack/c421f4.jpg',
          round_date_up_to: 600,
        })
        .reply(200, {
          signed_url:
            'https://myorg.rokka.io/mystack/c421f4.jpg?sig=xyz789&sigopts=%7B%22until%22%3A%222050-01-01T00%3A00%3A00.000Z%22%7D',
        })

      const resp = await rokka().utils.signUrl(
        'myorg',
        'https://myorg.rokka.io/mystack/c421f4.jpg',
        { roundDateUpTo: 600 },
      )

      expect(resp.body.signed_url).toContain('sig=')
      expect(resp.body.signed_url).toContain('sigopts=')
    })

    it('handles error responses', async () => {
      nock('https://api.rokka.io')
        .post('/utils/myorg/sign_url')
        .reply(403, {
          error: { message: 'Forbidden' },
        })

      try {
        await rokka().utils.signUrl(
          'myorg',
          'https://myorg.rokka.io/mystack/c421f4.jpg',
        )
        fail('Expected an error to be thrown')
      } catch (error: any) {
        expect(error.statusCode).toBe(403)
      }
    })
  })
})
