import test from 'ava'
import td from 'testdouble'

import * as transport from '../../src/transport'
const requestStub = td.replace(transport, 'default')

import rka from '../../src'

test('memberships.ROLES', t => {
  const rokka = rka()
  t.deepEqual(rokka.memberships.ROLES, { READ: 'read', WRITE: 'write', ADMIN: 'admin' })
})

test('memberships.create', t => {
  const rokka = rka({ apiKey: 'APIKEY' })

  rokka.memberships.create('myorg', 'user@example.org', rokka.memberships.ROLES.ADMIN)

  const expectedArgs = {
    method: 'PUT',
    uri: 'https://api.rokka.io/organizations/myorg/memberships/user@example.org',
    body: { role: 'admin' },
    qs: null
  }

  td.verify(requestStub(td.matchers.contains(expectedArgs), td.matchers.anything()))
})
