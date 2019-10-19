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
    body: null
  }

  td.verify(
    requestStub(
      'https://api.rokka.io/organizations/myorg',
      td.matchers.contains(expectedArgs),
      td.matchers.anything()
    )
  )
})

test('organizations.create', t => {
  const rokka = rka({ apiKey: 'APIKEY' })

  rokka.organizations.create(
    'myorg',
    'billing@example.org',
    'Organization Inc.'
  )

  const expectedArgs = {
    method: 'PUT',
    body: JSON.stringify({
      billing_email: 'billing@example.org',
      display_name: 'Organization Inc.'
    })
  }

  td.verify(
    requestStub(
      'https://api.rokka.io/organizations/myorg',
      td.matchers.contains(expectedArgs),
      td.matchers.anything()
    )
  )
})
