import test from 'ava'
import td from 'testdouble'

import * as apis from '../src/apis'

import rokka from '../src'
const apisStub = td.replace(apis, 'default')

test('default options', t => {
  const expectedState = {
    apiKey: undefined,
    apiHost: 'https://api.rokka.io',
    renderHost: 'https://{organization}.rokka.io',
    apiVersion: 1
  }

  rokka()

  td.verify(apisStub(td.matchers.contains(expectedState)), { times: 1 })
})

test('custom options', t => {
  const customOptions = {
    apiKey: 'APIKEY',
    apiHost: 'https://api.example.org',
    renderHost: 'https://{organization}.example.org',
    apiVersion: 2
  }

  rokka(customOptions)

  td.verify(apisStub(td.matchers.contains(customOptions)))
})

test('default transport options', t => {
  const expectedState = {
    transportOptions: {
      retries: 10,
      minTimeout: 1000,
      maxTimeout: 10000,
      randomize: true
    }
  }

  rokka()

  td.verify(apisStub(td.matchers.contains(expectedState)))
})

test('custom transport options', t => {
  const transportOptions = {
    retries: 23,
    minTimeout: 2323,
    maxTimeout: 232323,
    randomize: false
  }

  rokka({ transport: transportOptions })

  td.verify(apisStub(td.matchers.contains({ transportOptions })))
})
