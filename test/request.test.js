import test from 'ava'
import td from 'testdouble'

import * as apis from '../src/apis'
const apisStub = td.replace(apis, 'default')

import * as transport from '../src/transport'
const requestStub = td.replace(transport, 'default')

import rokka from '../src'

test('simple authorized request invocation', t => {
  rokka({ apiKey: 'APIKEY' })
  const request = td.explain(apisStub).calls.slice(-1)[0].args[0].request

  request('get', 'test')
})

test('simple non-authorized request invocation', t => {
  rokka()

  const request = td.explain(apisStub).calls.slice(-1)[0].args[0].request

  request('get', 'test', null, null, { noAuthHeaders: true })
})

test('missing API key', t => {
  rokka()

  const request = td.explain(apisStub).calls.slice(-1)[0].args[0].request

  t.throws(request('get', 'test'), 'Missing required property `apiKey`')
})

test('request argument handling', t => {
  const apiHost = 'https://api.example.org'
  const apiVersion = 23
  const apiKey = 'APIKEY'
  const path = 'test'
  const method = 'post'
  const body = { test: 'value' }
  const queryParams = { limit: 100, offset: 200 }

  const expectedArgs = {
    method,
    uri: `${apiHost}/${path}`,
    body,
    qs: queryParams,
    headers: { 'Api-Version': apiVersion, 'Api-Key': apiKey },
    json: true,
    resolveWithFullResponse: true,
    timeout: 30000
  }

  rokka({ apiHost, apiKey, apiVersion })

  const request = td.explain(apisStub).calls.slice(-1)[0].args[0].request

  request(method, path, body, queryParams)

  td.verify(requestStub(expectedArgs, td.matchers.isA(Object)))
})

test('retry options handling', t => {
  const transportOptions = {
    retries: 23,
    minTimeout: 2323,
    maxTimeout: 232323,
    randomize: false
  }

  rokka({ apiKey: 'APIKEY', transport: transportOptions })

  const request = td.explain(apisStub).calls.slice(-1)[0].args[0].request

  request('get', 'test')

  td.verify(requestStub(td.matchers.isA(Object), td.matchers.contains(transportOptions)))
})
