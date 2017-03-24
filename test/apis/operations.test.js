import test from 'ava'
import td from 'testdouble'

import * as transport from '../../src/transport'
const requestStub = td.replace(transport, 'default')

import rka from '../../src'

const knownOperations = ['resize', 'rotate', 'dropshadow', 'trim', 'crop', 'noop']

test('known operation functions exist', t => {
  t.plan(knownOperations.length)

  const rokka = rka({ apiKey: 'APIKEY' })

  knownOperations.forEach(key => {
    t.true(typeof rokka.operations[key] === 'function')
  })
})

test('operations.list', t => {
  const rokka = rka({ apiKey: 'APIKEY' })

  rokka.operations.list('myorg')

  const expectedArgs = {
    method: 'GET',
    uri: 'https://api.rokka.io/operations',
    body: null,
    qs: null
  }

  td.verify(requestStub(td.matchers.contains(expectedArgs), td.matchers.anything()))
})
