import test from 'ava'
import td from 'testdouble'

import * as transport from '../../src/transport'

import rka from '../../src'
const requestStub = td.replace(transport, 'default')

test('stats.get', t => {
  const rokka = rka({ apiKey: 'APIKEY' })

  rokka.stats.get('myorg', '2017-01-01', '2017-01-31')

  const expectedArgs = {
    method: 'GET',
    body: null
  }

  td.verify(
    requestStub(
      'https://api.rokka.io/stats/myorg?from=2017-01-01&to=2017-01-31',
      td.matchers.contains(expectedArgs),
      td.matchers.anything()
    )
  )
})
