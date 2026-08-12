import { rokka } from '../mockServer'
import nock from 'nock'

describe('user memberships and admin apikeys', () => {
  afterEach(() => {
    nock.cleanAll()
  })

  describe('user.listMemberships', () => {
    it('lists the organizations of the current user', async () => {
      nock('https://api.rokka.io')
        .matchHeader('Api-Key', 'APIKEY')
        .get('/user/memberships')
        .reply(200, {
          total: 2,
          items: [
            {
              organization: 'myorg',
              organization_id: '613547f8-e26d-48f6-8a6a-552c18b1a290',
              display_name: 'My Org',
              roles: ['admin'],
              active: true,
              last_access: '2026-07-20T10:00:00+02:00',
              created: '2021-01-01T00:00:00+01:00',
              comment: null,
            },
            {
              organization: 'other',
              organization_id: '613547f8-e26d-48f6-8a6a-552c18b1a291',
              display_name: 'Other Org',
              roles: ['read', 'billing:read'],
              active: true,
              last_access: null,
              created: null,
              comment: null,
            },
          ],
        })

      const resp = await rokka().user.listMemberships()

      expect(resp.body.total).toBe(2)
      expect(resp.body.items[0].organization).toBe('myorg')
      expect(resp.body.items[0].roles).toEqual(['admin'])
      // all three nullable fields can be null
      expect(resp.body.items[1].last_access).toBeNull()
      expect(resp.body.items[1].created).toBeNull()
      expect(resp.body.items[1].comment).toBeNull()
    })

    it('propagates the 403 for read-only keys', async () => {
      nock('https://api.rokka.io').get('/user/memberships').reply(403, {
        code: 403,
        message:
          'This user is marked as readonly and not allowed to list their memberships',
      })

      await expect(rokka().user.listMemberships()).rejects.toMatchObject({
        statusCode: 403,
      })
    })
  })

  describe('user.listAdminApiKeys', () => {
    it('lists members and their api key metadata', async () => {
      nock('https://api.rokka.io')
        .get('/user/admin/apikeys')
        .reply(200, {
          total: 1,
          truncated: false,
          items: [
            {
              organization: 'myorg',
              organization_id: '613547f8-e26d-48f6-8a6a-552c18b1a290',
              display_name: 'My Org',
              user_id: '613547f8-e26d-48f6-8a6a-552c18b1a292',
              email: 'someone@example.org',
              roles: ['write'],
              active: true,
              last_access: '2026-08-01T09:00:00+02:00',
              created: '2024-02-02T00:00:00+01:00',
              comment: null,
              api_keys: [
                {
                  id: 'keyid',
                  comment: null,
                  created: '2024-02-02T00:00:00+01:00',
                  accessed: '2026-08-01T09:00:00+02:00',
                  requires_mfa: false,
                  allowed_ips: [],
                  expires: null,
                },
              ],
            },
          ],
        })

      const resp = await rokka().user.listAdminApiKeys()

      expect(resp.body.truncated).toBe(false)
      expect(resp.body.items[0].email).toBe('someone@example.org')
      expect(resp.body.items[0].api_keys[0].allowed_ips).toEqual([])
      // key values are never returned
      expect(resp.body.items[0].api_keys[0].api_key).toBeUndefined()
    })

    it('surfaces truncated results', async () => {
      nock('https://api.rokka.io').get('/user/admin/apikeys').reply(200, {
        total: 1000,
        truncated: true,
        items: [],
      })

      const resp = await rokka().user.listAdminApiKeys()

      expect(resp.body.truncated).toBe(true)
    })

    it('propagates the 403 without admin:read', async () => {
      nock('https://api.rokka.io').get('/user/admin/apikeys').reply(403, {
        code: 403,
        message: 'This user is not allowed to list api keys',
      })

      await expect(rokka().user.listAdminApiKeys()).rejects.toMatchObject({
        statusCode: 403,
      })
    })
  })
})
