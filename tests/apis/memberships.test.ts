import { rokka, queryAndCheckAnswer } from '../mockServer'
import nock from 'nock'

describe('memberships', () => {
  it('memberships.ROLES', async () => {
    expect(rokka().memberships.ROLES).toEqual({
      READ: 'read',
      WRITE: 'write',
      UPLOAD: 'upload',
      ADMIN: 'admin',
      SOURCEIMAGES_DOWNLOAD_PROTECTED: 'sourceimages:download:protected',
      SOURCEIMAGE_READ: 'sourceimages:read',
      SOURCEIMAGE_UNLOCK: 'sourceimages:unlock',
      SOURCEIMAGE_WRITE: 'sourceimages:write',
      BILLING_READ: 'billing:read',
      ADMIN_READ: 'admin:read',
    })
  })

  it('memberships.createWithNewUser', async () => {
    await queryAndCheckAnswer(
      async () => {
        return rokka().memberships.createWithNewUser('rokka-js-tests', [
          rokka().memberships.ROLES.UPLOAD,
          rokka().memberships.ROLES.READ,
        ])
      },
      {
        mockFile: 'memberships_create_with_new_user.json',
      },
    )
  })

  it('memberships.createWithArray', async () => {
    await queryAndCheckAnswer(
      async () => {
        return rokka().memberships.create(
          'rokka-js-tests',
          '679cd7aa-5445-4d6a-8d56-930557a2a77e',
          [rokka().memberships.ROLES.UPLOAD, rokka().memberships.ROLES.WRITE],
        )
      },
      {
        mockFile: 'memberships_create_with_array.json',
      },
    )
  })

  describe('memberships.createWithNewUser api_key', () => {
    afterEach(() => {
      nock.cleanAll()
    })

    it('sends the api_key block when given', async () => {
      nock('https://api.rokka.io')
        .post('/organizations/myorg/memberships', {
          roles: ['read'],
          comment: 'CI user',
          api_key: { comment: 'initial key', trusted: true },
        })
        .reply(200, { user_id: 'userid', api_key: 'key' })

      const resp = await rokka().memberships.createWithNewUser(
        'myorg',
        [rokka().memberships.ROLES.READ],
        'CI user',
        { comment: 'initial key', trusted: true },
      )

      expect(resp.body.user_id).toBe('userid')
    })

    it('sends all key options', async () => {
      nock('https://api.rokka.io')
        .post('/organizations/myorg/memberships', {
          roles: ['read'],
          comment: null,
          api_key: {
            trusted: true,
            requires_mfa: true,
            allowed_ips: ['1.2.3.4'],
            expires: '2027-01-01T00:00:00+00:00',
          },
        })
        .reply(200, { user_id: 'userid', api_key: 'key' })

      const resp = await rokka().memberships.createWithNewUser(
        'myorg',
        [rokka().memberships.ROLES.READ],
        null,
        {
          trusted: true,
          requires_mfa: true,
          allowed_ips: ['1.2.3.4'],
          expires: '2027-01-01T00:00:00+00:00',
        },
      )

      expect(resp.body.user_id).toBe('userid')
    })

    it('omits api_key entirely when not given', async () => {
      nock('https://api.rokka.io')
        .post(
          '/organizations/myorg/memberships',
          body => !('api_key' in body) && body.roles[0] === 'read',
        )
        .reply(200, { user_id: 'userid', api_key: 'key' })

      const resp = await rokka().memberships.createWithNewUser('myorg', [
        rokka().memberships.ROLES.READ,
      ])

      expect(resp.body.user_id).toBe('userid')
    })

    it('propagates the 400 for requires_mfa without trusted', async () => {
      nock('https://api.rokka.io')
        .post('/organizations/myorg/memberships')
        .reply(400, {
          code: 400,
          message:
            'api_key.trusted must be true when api_key.requires_mfa is enabled for a read-only membership',
        })

      await expect(
        rokka().memberships.createWithNewUser(
          'myorg',
          [rokka().memberships.ROLES.READ],
          null,
          { requires_mfa: true },
        ),
      ).rejects.toMatchObject({ statusCode: 400 })
    })
  })

  it('memberships.list', async () => {
    await queryAndCheckAnswer(
      async () => rokka().memberships.list('rokka-js-tests'),
      {
        mockFile: 'memberships_list.json',
      },
    )
  })

  it('memberships.delete', async () => {
    await queryAndCheckAnswer(
      async () =>
        rokka().memberships.delete(
          'rokka-js-tests',
          '679cd7aa-5445-4d6a-8d56-930557a2a77e',
        ),
      {
        mockFile: 'memberships_delete.json',
      },
    )
  })
})
