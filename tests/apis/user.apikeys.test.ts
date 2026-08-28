import { rokka } from '../mockServer'
import nock from 'nock'

describe('user.apikeys restrictions', () => {
  afterEach(() => {
    nock.cleanAll()
  })

  describe('user.addApiKey', () => {
    it('posts allowed_ips and expires', async () => {
      nock('https://api.rokka.io')
        .post('/user/apikeys', {
          comment: 'ci key',
          allowed_ips: ['192.168.0.5', '10.0.0.0/24'],
          expires: '2027-01-01T00:00:00+00:00',
        })
        .reply(200, {
          id: 'keyid',
          api_key: 'key',
          comment: 'ci key',
          allowed_ips: ['192.168.0.5', '10.0.0.0/24'],
          expires: '2027-01-01T00:00:00+00:00',
        })

      const resp = await rokka().user.addApiKey('ci key', {
        allowed_ips: ['192.168.0.5', '10.0.0.0/24'],
        expires: '2027-01-01T00:00:00+00:00',
      })

      expect(resp.body.allowed_ips).toEqual(['192.168.0.5', '10.0.0.0/24'])
      expect(resp.body.expires).toBe('2027-01-01T00:00:00+00:00')
      // the response only echoes back what was supplied
      expect(resp.body.requires_mfa).toBeUndefined()
    })

    it('serializes a Date expires as ISO 8601', async () => {
      nock('https://api.rokka.io')
        .post(
          '/user/apikeys',
          body => body.expires === '2027-01-01T00:00:00.000Z',
        )
        .reply(200, { id: 'keyid', api_key: 'key', comment: 'ci key' })

      const resp = await rokka().user.addApiKey('ci key', {
        expires: new Date(Date.UTC(2027, 0, 1)),
      })

      expect(resp.body.id).toBe('keyid')
    })

    it('posts trusted', async () => {
      nock('https://api.rokka.io')
        .post('/user/apikeys', { comment: 'deploy key', trusted: true })
        .reply(200, {
          id: 'keyid',
          api_key: 'key',
          comment: 'deploy key',
          trusted: true,
        })

      const resp = await rokka().user.addApiKey('deploy key', {
        trusted: true,
      })

      expect(resp.body.trusted).toBe(true)
    })

    it('propagates a 400 for an invalid allowed_ips entry', async () => {
      nock('https://api.rokka.io').post('/user/apikeys').reply(400, {
        code: 400,
        message: 'allowed_ips entries must be non-empty strings',
      })

      await expect(
        rokka().user.addApiKey('ci key', { allowed_ips: [' '] }),
      ).rejects.toMatchObject({ statusCode: 400 })
    })
  })

  describe('user.patchApiKey', () => {
    it('patches allowed_ips without adding a query string', async () => {
      nock('https://api.rokka.io')
        .patch('/user/apikeys/keyid', { allowed_ips: ['1.2.3.4'] })
        .reply(200, {
          id: 'keyid',
          comment: null,
          requires_mfa: false,
          totp_state: 'none',
          allowed_ips: ['1.2.3.4'],
          expires: null,
        })

      const resp = await rokka().user.patchApiKey('keyid', {
        allowed_ips: ['1.2.3.4'],
      })

      expect(resp.body.allowed_ips).toEqual(['1.2.3.4'])
      expect(resp.body.expires).toBeNull()
      expect(resp.body.totp_state).toBe('none')
    })

    it('clears both restrictions with null', async () => {
      nock('https://api.rokka.io')
        .patch('/user/apikeys/keyid', { allowed_ips: null, expires: null })
        .reply(200, {
          id: 'keyid',
          comment: null,
          requires_mfa: false,
          totp_state: 'none',
          allowed_ips: [],
          expires: null,
        })

      const resp = await rokka().user.patchApiKey('keyid', {
        allowed_ips: null,
        expires: null,
      })

      expect(resp.body.allowed_ips).toEqual([])
    })

    it('patches trusted alone', async () => {
      nock('https://api.rokka.io')
        .patch('/user/apikeys/keyid', { trusted: true })
        .reply(200, {
          id: 'keyid',
          comment: null,
          requires_mfa: false,
          totp_state: 'none',
          trusted: true,
          allowed_ips: [],
          expires: null,
        })

      const resp = await rokka().user.patchApiKey('keyid', { trusted: true })

      expect(resp.body.trusted).toBe(true)
    })

    it('propagates the self lockout 400 when clearing trusted', async () => {
      nock('https://api.rokka.io')
        .patch('/user/apikeys/keyid', { trusted: false })
        .reply(400, {
          code: 400,
          message:
            'Clearing trusted would lock this key out of your own key management, use a different key or pass ?force=true to override.',
        })

      await expect(
        rokka().user.patchApiKey('keyid', { trusted: false }),
      ).rejects.toMatchObject({ statusCode: 400 })
    })

    it('sends force=true when asked for', async () => {
      nock('https://api.rokka.io')
        .patch('/user/apikeys/keyid', { allowed_ips: ['9.9.9.9'] })
        .query({ force: 'true' })
        .reply(200, {
          id: 'keyid',
          comment: null,
          requires_mfa: false,
          totp_state: 'none',
          allowed_ips: ['9.9.9.9'],
          expires: null,
        })

      const resp = await rokka().user.patchApiKey(
        'keyid',
        { allowed_ips: ['9.9.9.9'] },
        { force: true },
      )

      expect(resp.body.allowed_ips).toEqual(['9.9.9.9'])
    })

    it('does not send force when it is false', async () => {
      nock('https://api.rokka.io')
        .patch('/user/apikeys/keyid', { requires_mfa: true })
        .reply(200, { id: 'keyid', requires_mfa: true })

      const resp = await rokka().user.patchApiKey(
        'keyid',
        { requires_mfa: true },
        { force: false },
      )

      expect(resp.body.requires_mfa).toBe(true)
    })

    it('rejects an empty options object without doing a request', async () => {
      const scope = nock('https://api.rokka.io')
        .patch('/user/apikeys/keyid')
        .reply(200, {})

      await expect(rokka().user.patchApiKey('keyid', {})).rejects.toThrowError(
        'Provide at least one of requires_mfa, trusted, allowed_ips or expires in the JSON body',
      )
      expect(scope.isDone()).toBe(false)
    })

    it('rejects options with only undefined values', async () => {
      const scope = nock('https://api.rokka.io')
        .patch('/user/apikeys/keyid')
        .reply(200, {})

      await expect(
        rokka().user.patchApiKey('keyid', { expires: undefined }),
      ).rejects.toThrowError('Provide at least one of')
      expect(scope.isDone()).toBe(false)
    })

    it('propagates the self lockout 400', async () => {
      nock('https://api.rokka.io')
        .patch('/user/apikeys/keyid', { allowed_ips: ['9.9.9.9'] })
        .reply(400, {
          code: 400,
          message:
            'This allowed_ips whitelist would lock this key out from your current IP (1.2.3.4). Include your current IP, use a different key, or pass ?force=true to override.',
        })

      await expect(
        rokka().user.patchApiKey('keyid', { allowed_ips: ['9.9.9.9'] }),
      ).rejects.toMatchObject({ statusCode: 400 })
    })
  })

  describe('UserApiKey with restrictions', () => {
    it('returns allowed_ips and expires on listApiKeys', async () => {
      nock('https://api.rokka.io')
        .get('/user/apikeys')
        .reply(200, [
          {
            id: 'keyid',
            comment: 'ci key',
            requires_mfa: false,
            trusted: true,
            allowed_ips: ['1.2.3.4'],
            expires: '2027-01-01T00:00:00+00:00',
          },
        ])

      const resp = await rokka().user.listApiKeys()

      expect(resp.body[0].allowed_ips).toEqual(['1.2.3.4'])
      expect(resp.body[0].expires).toBe('2027-01-01T00:00:00+00:00')
      expect(resp.body[0].trusted).toBe(true)
    })

    it('returns allowed_ips and expires on getCurrentApiKey', async () => {
      nock('https://api.rokka.io').get('/user/apikeys/current').reply(200, {
        id: 'keyid',
        comment: null,
        requires_mfa: false,
        allowed_ips: [],
        expires: null,
      })

      const resp = await rokka().user.getCurrentApiKey()

      expect(resp.body.allowed_ips).toEqual([])
      expect(resp.body.expires).toBeNull()
    })
  })

  describe('restriction authentication errors', () => {
    it('propagates key_expired', async () => {
      nock('https://api.rokka.io').get('/user').reply(401, {
        code: 401,
        message: 'This API key has expired',
        error: 'key_expired',
        invalid_authentication: true,
      })

      await expect(rokka().user.get()).rejects.toMatchObject({
        statusCode: 401,
        body: { error: 'key_expired', invalid_authentication: true },
      })
    })

    it('propagates ip_not_allowed', async () => {
      nock('https://api.rokka.io').get('/user').reply(401, {
        code: 401,
        message: 'This API key is not allowed from this IP',
        error: 'ip_not_allowed',
        invalid_authentication: true,
      })

      await expect(rokka().user.get()).rejects.toMatchObject({
        statusCode: 401,
        body: { error: 'ip_not_allowed' },
      })
    })
  })
})
