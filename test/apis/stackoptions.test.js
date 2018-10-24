import test from 'ava'
import td from 'testdouble'

import * as transport from '../../src/transport'

import rka from '../../src'
const requestStub = td.replace(transport, 'default')

test('stackoptions.get', t => {
  const rokka = rka()

  rokka.stackoptions.get()

  const expectedArgs = {
    method: 'GET',
    uri: 'https://api.rokka.io/stackoptions',
    body: null,
    qs: null
  }

  td.verify(
    requestStub(td.matchers.contains(expectedArgs), td.matchers.anything())
  )
})
