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
    body: JSON.stringify({
      email: 'user@example.org',
      organization: 'user-at-example-organization'
    })
  }

  td.verify(
    requestStub(
      'https://api.rokka.io/users',
      td.matchers.contains(expectedArgs),
      td.matchers.anything()
    )
  )
})

test('users.getId', t => {
  const rokka = rka({ apiKey: 'APIKEY' })

  const expectedArgs = {
    method: 'GET',
    body: null
  }
  td.when(
    requestStub(
      'https://api.rokka.io/user',
      td.matchers.contains(expectedArgs),
      td.matchers.anything()
    )
  ).thenResolve({ statusCode: 200, body: { user_id: 'abc' } })

  rokka.users.getId().then(userId => {
    t.is(userId, 'abc')
  })
})
