import test from 'ava'
import td from 'testdouble'

import * as transport from '../../src/transport'
const requestStub = td.replace(transport, 'default')

import rka from '../../src'

test('users.create', t => {
  const rokka = rka({ apiKey: 'APIKEY' })

  rokka.users.create('user@example.org', 'user-at-example-organization')

  const expectedArgs = {
    method: 'POST',
    uri: 'https://api.rokka.io/users',
    body: { email: 'user@example.org', organization: 'user-at-example-organization' }
  }

  td.verify(requestStub(td.matchers.contains(expectedArgs), td.matchers.anything()))
})
