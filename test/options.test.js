import test from 'ava'
import td from 'testdouble'

import * as apis from '../src/apis'
const modules = td.replace(apis, 'default')
import _rokka from '../src'

test('default options', t => {
  const expectedState = {
    apiKey: undefined,
    apiHost: 'https://api.rokka.io',
    renderHost: 'https://{organization}.rokka.io',
    apiVersion: 1
  }

  _rokka()

  td.verify(modules(td.matchers.contains(expectedState)), { times: 1 })
})

test('custom options', t => {
  const customOptions = {
    apiHost: 'https://api.example.org',
    renderHost: 'https://{organization}.example.org',
    apiVersion: 2
  }

  _rokka(customOptions)

  td.verify(modules(td.matchers.contains(customOptions)))
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

  _rokka()

  td.verify(modules(td.matchers.contains(expectedState)))
})

test('custom transport options', t => {
  const transportOptions = {
    retries: 23,
    minTimeout: 2323,
    maxTimeout: 232323,
    randomize: false
  }

  _rokka({ transport: transportOptions })

  td.verify(modules(td.matchers.contains({ transportOptions })))
})
