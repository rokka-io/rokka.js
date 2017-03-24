import test from 'ava'
import td from 'testdouble'

import * as transport from '../../src/transport'
const requestStub = td.replace(transport, 'default')

import rka from '../../src'

test('users.create', t => {
  const rokka = rka({ apiKey: 'APIKEY' })

  rokka.users.create('user@example.org')

  const expectedArgs = {
    method: 'POST',
    uri: 'https://api.rokka.io/users',
    body: { email: 'user@example.org' }
  }

  td.verify(requestStub(td.matchers.contains(expectedArgs), td.matchers.anything()))
})
