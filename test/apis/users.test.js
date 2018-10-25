import test from 'ava'
import td from 'testdouble'

import * as transport from '../../src/transport'

import rka from '../../src'
const requestStub = td.replace(transport, 'default')

test('users.create', t => {
  const rokka = rka({ apiKey: 'APIKEY' })

  rokka.users.create('user@example.org', 'user-at-example-organization')

  const expectedArgs = {
    method: 'POST',
    uri: 'https://api.rokka.io/users',
    body: {
      email: 'user@example.org',
      organization: 'user-at-example-organization'
    }
  }

  td.verify(
    requestStub(td.matchers.contains(expectedArgs), td.matchers.anything())
  )
})

test('users.getId', t => {
  const rokka = rka({ apiKey: 'APIKEY' })

  const expectedArgs = {
    method: 'GET',
    uri: 'https://api.rokka.io/user',
    body: null,
    qs: null
  }
  td.when(
    requestStub(td.matchers.contains(expectedArgs), td.matchers.anything())
  ).thenResolve({ statusCode: 200, body: { user_id: 'abc' } })

  rokka.users.getId().then(userId => {
    t.is(userId, 'abc')
  })
})
