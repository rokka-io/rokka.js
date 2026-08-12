import { rokka } from '../mockServer'
import nock from 'nock'

const subOrg = {
  name: 'suborg-a',
  id: '613547f8-e26d-48f6-8a6a-552c18b1a290',
  display_name: 'Sub Org A',
  billing_email: 'billing@example.org',
  created: '2023-05-05T00:00:00+02:00',
}

describe('organizations.listSubOrganizations', () => {
  afterEach(() => {
    nock.cleanAll()
  })

  it('lists the sub organizations of a master organization', async () => {
    // no .query() at all, so this only matches without a query string
    nock('https://api.rokka.io')
      .get('/organizations/mastername/sub_organizations')
      .reply(200, {
        organization: 'mastername',
        master_organization: 'mastername',
        total: 1,
        items: [subOrg],
      })

    const resp = await rokka().organizations.listSubOrganizations('mastername')

    expect(resp.body.total).toBe(1)
    expect(resp.body.master_organization).toBe('mastername')
    expect(resp.body.items[0].name).toBe('suborg-a')
    expect(resp.body.items[0].billing_email).toBe('billing@example.org')
  })

  it('sends include_disabled when given', async () => {
    nock('https://api.rokka.io')
      .get('/organizations/mastername/sub_organizations')
      .query({ include_disabled: 'true' })
      .reply(200, {
        organization: 'mastername',
        master_organization: 'mastername',
        total: 1,
        items: [{ ...subOrg, disabled: false }],
      })

    const resp = await rokka().organizations.listSubOrganizations(
      'mastername',
      { include_disabled: true },
    )

    expect(resp.body.items[0].disabled).toBe(false)
  })

  it('sends include_disabled=false explicitly when given', async () => {
    nock('https://api.rokka.io')
      .get('/organizations/mastername/sub_organizations')
      .query({ include_disabled: 'false' })
      .reply(200, {
        organization: 'mastername',
        master_organization: 'mastername',
        total: 0,
        items: [],
      })

    const resp = await rokka().organizations.listSubOrganizations(
      'mastername',
      { include_disabled: false },
    )

    expect(resp.body.total).toBe(0)
  })

  it('returns an empty list with the master to ask instead, for a sub organization', async () => {
    nock('https://api.rokka.io')
      .get('/organizations/suborg-a/sub_organizations')
      .reply(200, {
        organization: 'suborg-a',
        master_organization: 'mastername',
        total: 0,
        items: [],
      })

    const resp = await rokka().organizations.listSubOrganizations('suborg-a')

    expect(resp.body.items).toHaveLength(0)
    expect(resp.body.master_organization).toBe('mastername')
  })

  it('propagates the 403 without admin or admin:read', async () => {
    nock('https://api.rokka.io')
      .get('/organizations/mastername/sub_organizations')
      .reply(403, { code: 403, message: 'Not allowed' })

    await expect(
      rokka().organizations.listSubOrganizations('mastername'),
    ).rejects.toMatchObject({ statusCode: 403 })
  })

  it('propagates the 403 when a non super admin asks for disabled orgs', async () => {
    nock('https://api.rokka.io')
      .get('/organizations/mastername/sub_organizations')
      .query({ include_disabled: 'true' })
      .reply(403, {
        code: 403,
        message: 'Only super admins may include disabled organizations',
      })

    await expect(
      rokka().organizations.listSubOrganizations('mastername', {
        include_disabled: true,
      }),
    ).rejects.toMatchObject({ statusCode: 403 })
  })

  it('propagates the 404 for an unknown organization', async () => {
    nock('https://api.rokka.io')
      .get('/organizations/doesnotexist/sub_organizations')
      .reply(404, { code: 404, message: 'Organization not found' })

    await expect(
      rokka().organizations.listSubOrganizations('doesnotexist'),
    ).rejects.toMatchObject({ statusCode: 404 })
  })
})
