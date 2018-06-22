import test from 'ava'
import td from 'testdouble'

import * as transport from '../../src/transport'

import rka from '../../src'
const requestStub = td.replace(transport, 'default')

const knownOperations = ['resize', 'autorotate', 'rotate', 'dropshadow', 'trim', 'crop', 'noop', 'composition', 'blur']

test('known operation functions exist', t => {
  t.plan(knownOperations.length)

  const rokka = rka({ apiKey: 'APIKEY' })

  knownOperations.forEach(key => {
    t.true(typeof rokka.operations[key] === 'function')
  })
})

test('operations.list', t => {
  const rokka = rka()

  rokka.operations.list()

  const expectedArgs = {
    method: 'GET',
    uri: 'https://api.rokka.io/operations',
    body: null,
    qs: null
  }

  td.verify(requestStub(td.matchers.contains(expectedArgs), td.matchers.anything()))
})
