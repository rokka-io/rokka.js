import { rokka } from '../mockServer'
import rka from '../../src'
import nock from 'nock'

const b64url = (obj: object): string =>
  Buffer.from(JSON.stringify(obj)).toString('base64url')

const validToken = (): string =>
  `${b64url({ alg: 'HS256', typ: 'JWT' })}.${b64url({
    id: 'someuser',
    exp: Math.floor(Date.now() / 1000) + 3600,
    rn: true,
  })}.signature`

describe('user.mfa', () => {
  afterEach(() => {
    nock.cleanAll()
  })

  describe('user.getNewToken with totp', () => {
    it('sends the totp in the POST body and uses the Api-Key header', async () => {
      nock('https://api.rokka.io')
        .matchHeader('Api-Key', 'APIKEY')
        .post('/user/apikeys/token', { totp: '123456' })
        .query(true)
        .reply(200, { token: validToken(), payload: {} })

      const resp = await rokka().user.getNewToken('APIKEY', {
        totp: '123456',
      })

      expect(resp.body.token).toBeTruthy()
    })

    it('strips a stale totp from apiTokenOptions on renewals', async () => {
      const client = rka({
        apiKey: 'APIKEY',
        transport: { retries: 0 },
        apiTokenOptions: { totp: '999999', expires_in: 600 },
      })

      // no totp in the body, and the stale one is not in the query either
      nock('https://api.rokka.io')
        .post('/user/apikeys/token', body => body.totp === undefined)
        .query(q => q.totp === undefined && q.expires_in === '600')
        .reply(200, { token: validToken(), payload: {} })

      const resp = await client.user.getNewToken('APIKEY')

      expect(resp.body.token).toBeTruthy()
    })

    it('forces the Api-Key header for a totp exchange, even with a valid token', async () => {
      const client = rka({
        apiKey: 'APIKEY',
        transport: { retries: 0 },
        apiTokenGetCallback: () => validToken(),
        apiTokenSetCallback: () => undefined,
      })

      let authorizationHeader: string | undefined = 'not-checked'
      nock('https://api.rokka.io')
        .matchHeader('Api-Key', 'APIKEY')
        .post('/user/apikeys/token', { totp: '123456' })
        .query(true)
        .reply(200, function () {
          authorizationHeader = this.req.headers['authorization']
          return { token: validToken(), payload: {} }
        })

      await client.user.getNewToken('APIKEY', { totp: '123456' })

      expect(authorizationHeader).toBeUndefined()
    })

    it('propagates totp_invalid errors', async () => {
      nock('https://api.rokka.io')
        .post('/user/apikeys/token')
        .query(true)
        .reply(401, {
          code: 401,
          message:
            'A valid totp property in the JSON body is required for this API key',
          error: 'totp_invalid',
          invalid_authentication: true,
        })

      await expect(
        rokka().user.getNewToken('APIKEY', { totp: '000000' }),
      ).rejects.toMatchObject({
        statusCode: 401,
        body: { error: 'totp_invalid' },
      })
    })

    it('propagates totp_rate_limited errors', async () => {
      // mockServer's rokka() sets transport.retries = 0, otherwise the
      // transport would retry the 429 a few times before throwing
      nock('https://api.rokka.io')
        .post('/user/apikeys/token')
        .query(true)
        .reply(429, {
          code: 429,
          message: 'Too many TOTP attempts, try again later',
          error: 'totp_rate_limited',
        })

      await expect(
        rokka().user.getNewToken('APIKEY', { totp: '000000' }),
      ).rejects.toMatchObject({
        statusCode: 429,
        body: { error: 'totp_rate_limited' },
      })
    })
  })

  describe('user.addApiKey', () => {
    it('posts only the comment without options (backward compatible)', async () => {
      nock('https://api.rokka.io')
        .post('/user/apikeys', { comment: 'some comment' })
        .reply(200, { id: 'keyid', api_key: 'key', comment: 'some comment' })

      const resp = await rokka().user.addApiKey('some comment')

      expect(resp.body.id).toBe('keyid')
    })

    it('posts requires_mfa when given', async () => {
      nock('https://api.rokka.io')
        .post('/user/apikeys', { comment: 'client key', requires_mfa: true })
        .reply(200, {
          id: 'keyid',
          api_key: 'key',
          comment: 'client key',
          requires_mfa: true,
          totp_state: 'none',
        })

      const resp = await rokka().user.addApiKey('client key', {
        requires_mfa: true,
      })

      expect(resp.body.requires_mfa).toBe(true)
      expect(resp.body.totp_state).toBe('none')
    })
  })

  describe('user.patchApiKey', () => {
    it('patches requires_mfa on a key', async () => {
      nock('https://api.rokka.io')
        .patch('/user/apikeys/keyid', { requires_mfa: true })
        .reply(200, {
          id: 'keyid',
          comment: null,
          requires_mfa: true,
          totp_state: 'active',
        })

      const resp = await rokka().user.patchApiKey('keyid', {
        requires_mfa: true,
      })

      expect(resp.body.requires_mfa).toBe(true)
      expect(resp.body.totp_state).toBe('active')
    })
  })

  describe('user mfa totp lifecycle', () => {
    it('gets the totp state', async () => {
      nock('https://api.rokka.io')
        .get('/user/mfa/totp')
        .reply(200, { state: 'none', confirmed: null })

      const resp = await rokka().user.getMfaTotp()

      expect(resp.body.state).toBe('none')
    })

    it('sets up totp and returns secret and provisioning uri', async () => {
      nock('https://api.rokka.io').post('/user/mfa/totp').reply(200, {
        secret: 'JBSWY3DPEHPK3PXP',
        provisioning_uri:
          'otpauth://totp/rokka%3Auser%40example.com?issuer=rokka&secret=JBSWY3DPEHPK3PXP',
        state: 'pending',
      })

      const resp = await rokka().user.setupMfaTotp()

      expect(resp.body.secret).toBe('JBSWY3DPEHPK3PXP')
      expect(resp.body.provisioning_uri).toMatch(/^otpauth:\/\/totp\//)
      expect(resp.body.state).toBe('pending')
    })

    it('confirms totp with a code', async () => {
      nock('https://api.rokka.io')
        .post('/user/mfa/totp/confirm', { totp: '123456' })
        .reply(200, { state: 'active', confirmed: '2026-07-10T10:00:00+02:00' })

      const resp = await rokka().user.confirmMfaTotp('123456')

      expect(resp.body.state).toBe('active')
    })

    it('disables totp with a code', async () => {
      nock('https://api.rokka.io')
        .delete('/user/mfa/totp', { totp: '123456' })
        .reply(204)

      const resp = await rokka().user.disableMfaTotp('123456')

      expect(resp.statusCode).toBe(204)
    })
  })
})
