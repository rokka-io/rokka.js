import test from 'ava'
import td from 'testdouble'

import * as transport from '../../src/transport'

import rka from '../../src'
const requestStub = td.replace(transport, 'default')

test('organizations.get', t => {
  const rokka = rka({ apiKey: 'APIKEY' })

  rokka.organizations.get('myorg')

  const expectedArgs = {
    method: 'GET',
    uri: 'https://api.rokka.io/organizations/myorg',
    body: null,
    qs: null
  }

  td.verify(requestStub(td.matchers.contains(expectedArgs), td.matchers.anything()))
})

test('organizations.create', t => {
  const rokka = rka({ apiKey: 'APIKEY' })

  rokka.organizations.create('myorg', 'billing@example.org', 'Organization Inc.')

  const expectedArgs = {
    method: 'PUT',
    uri: 'https://api.rokka.io/organizations/myorg',
    body: { billing_email: 'billing@example.org', display_name: 'Organization Inc.' },
    qs: null
  }

  td.verify(requestStub(td.matchers.contains(expectedArgs), td.matchers.anything()))
})
