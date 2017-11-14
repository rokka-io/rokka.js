import test from 'ava'
import td from 'testdouble'

import * as transport from '../../src/transport'
const requestStub = td.replace(transport, 'default')

import rka from '../../src'

test('stacks.list', t => {
  const rokka = rka({ apiKey: 'APIKEY' })

  rokka.stacks.list('myorg')

  const expectedArgs = {
    method: 'GET',
    uri: 'https://api.rokka.io/stacks/myorg',
    body: null,
    qs: {}
  }
  td.verify(requestStub(td.matchers.contains(expectedArgs), td.matchers.anything()))
})

test('stacks.get', t => {
  const rokka = rka({ apiKey: 'APIKEY' })

  rokka.stacks.get('myorg', 'mystack')

  const expectedArgs = {
    method: 'GET',
    uri: 'https://api.rokka.io/stacks/myorg/mystack',
    body: null,
    qs: null
  }

  td.verify(requestStub(td.matchers.contains(expectedArgs), td.matchers.anything()))
})

test('stacks.create (version <=0.26)', t => {
  const rokka = rka({ apiKey: 'APIKEY' })
  const options = {'jpg.quality': 76}
  const operations = [
    rokka.operations.rotate(45),
    rokka.operations.resize(100, 100)
  ]

  rokka.stacks.create('myorg', 'mystack', operations, options)

  const expectedArgs = {
    method: 'PUT',
    uri: 'https://api.rokka.io/stacks/myorg/mystack',
    body: {operations, options},
    qs: {}
  }

  td.verify(requestStub(td.matchers.contains(expectedArgs), td.matchers.anything()))
})

test('stacks.create', t => {
  const rokka = rka({ apiKey: 'APIKEY' })
  const options = {'jpg.quality': 76}
  const operations = [
    rokka.operations.rotate(45),
    rokka.operations.resize(100, 100)
  ]

  rokka.stacks.create('myorg', 'mystack', {operations: operations, options: options})

  const expectedArgs = {
    method: 'PUT',
    uri: 'https://api.rokka.io/stacks/myorg/mystack',
    body: {operations, options},
    qs: {}
  }

  td.verify(requestStub(td.matchers.contains(expectedArgs), td.matchers.anything()))
})

test('stacks.create (with expressions)', t => {
  const rokka = rka({ apiKey: 'APIKEY' })
  const options = {'jpg.quality': 76}
  const operations = [
    rokka.operations.rotate(45),
    rokka.operations.resize(100, 100)
  ]
  const expressions = [
    rokka.expressions.default('options.dpr >= 2', {'jpg.quality': 60, 'webp.quality': 60})
  ]
  rokka.stacks.create('myorg', 'mystack', {operations: operations, options: options, expressions: expressions})
  const expectedArgs = {
    method: 'PUT',
    uri: 'https://api.rokka.io/stacks/myorg/mystack',
    body: {operations: operations, options: options, expressions: expressions},
    qs: {}
  }

  td.verify(requestStub(td.matchers.contains(expectedArgs), td.matchers.anything()))
})

test('stacks.createOverwrite', t => {
  const rokka = rka({ apiKey: 'APIKEY' })
  const options = {'jpg.quality': 76}
  const operations = [
    rokka.operations.rotate(45),
    rokka.operations.resize(100, 100)
  ]

  rokka.stacks.create('myorg', 'mystack', {operations: operations, options: options}, {overwrite: true})

  const expectedArgs = {
    method: 'PUT',
    uri: 'https://api.rokka.io/stacks/myorg/mystack',
    body: {operations, options},
    qs: {overwrite: 'true'}
  }

  td.verify(requestStub(td.matchers.contains(expectedArgs), td.matchers.anything()))
})

test('stacks.createOverwrite (version <=0.26)', t => {
  const rokka = rka({ apiKey: 'APIKEY' })
  const options = {'jpg.quality': 76}
  const operations = [
    rokka.operations.rotate(45),
    rokka.operations.resize(100, 100)
  ]

  rokka.stacks.create('myorg', 'mystack', operations, options, true)

  const expectedArgs = {
    method: 'PUT',
    uri: 'https://api.rokka.io/stacks/myorg/mystack',
    body: {operations, options},
    qs: {overwrite: 'true'}
  }

  td.verify(requestStub(td.matchers.contains(expectedArgs), td.matchers.anything()))
})

test('stacks.delete', t => {
  const rokka = rka({ apiKey: 'APIKEY' })

  rokka.stacks.delete('myorg', 'mystack')

  const expectedArgs = {
    method: 'DELETE',
    uri: 'https://api.rokka.io/stacks/myorg/mystack',
    body: null,
    qs: null
  }

  td.verify(requestStub(td.matchers.contains(expectedArgs), td.matchers.anything()))
})
