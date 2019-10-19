import test from 'ava'
import td from 'testdouble'

import * as transport from '../../src/transport'

import rka from '../../src'
const requestStub = td.replace(transport, 'default')

test('stacks.list', t => {
  const rokka = rka({ apiKey: 'APIKEY' })

  rokka.stacks.list('myorg')

  const expectedArgs = {
    method: 'GET',
    body: null
  }
  td.verify(
    requestStub(
      'https://api.rokka.io/stacks/myorg',
      td.matchers.contains(expectedArgs),
      td.matchers.anything()
    )
  )
})

test('stacks.get', t => {
  const rokka = rka({ apiKey: 'APIKEY' })

  rokka.stacks.get('myorg', 'mystack')

  const expectedArgs = {
    method: 'GET',
    body: null
  }

  td.verify(
    requestStub(
      'https://api.rokka.io/stacks/myorg/mystack',
      td.matchers.contains(expectedArgs),
      td.matchers.anything()
    )
  )
})

test('stacks.create', t => {
  const rokka = rka({ apiKey: 'APIKEY' })
  const options = { 'jpg.quality': 77 }
  const operations = [
    rokka.operations.rotate(45),
    rokka.operations.resize(100, 100)
  ]

  rokka.stacks.create('myorg', 'mystack', {
    operations: operations,
    options: options
  })

  const expectedArgs = {
    method: 'PUT',
    body: JSON.stringify({ operations, options })
  }

  td.verify(
    requestStub(
      'https://api.rokka.io/stacks/myorg/mystack',
      td.matchers.contains(expectedArgs),
      td.matchers.anything()
    )
  )
})

test('stacks.create (version <=0.26)', t => {
  const rokka = rka({ apiKey: 'APIKEY' })
  const options = { 'jpg.quality': 76 }
  const operations = [
    rokka.operations.rotate(45),
    rokka.operations.resize(100, 100)
  ]

  rokka.stacks.create('myorg', 'mystack', operations, options)

  const expectedArgs = {
    method: 'PUT',
    body: JSON.stringify({ operations, options })
  }

  td.verify(
    requestStub(
      'https://api.rokka.io/stacks/myorg/mystack',
      td.matchers.contains(expectedArgs),
      td.matchers.anything()
    )
  )
})

test('stacks.create (with expressions)', t => {
  const rokka = rka({ apiKey: 'APIKEY' })
  const options = { 'jpg.quality': 78 }
  const operations = [
    rokka.operations.rotate(45),
    rokka.operations.resize(100, 100)
  ]
  const expressions = [
    rokka.expressions.default('options.dpr >= 2', {
      'jpg.quality': 60,
      'webp.quality': 60
    })
  ]
  rokka.stacks.create('myorg', 'mystack', { operations, options, expressions })
  const expectedArgs = {
    method: 'PUT',
    body: JSON.stringify({ operations, options, expressions })
  }

  td.verify(
    requestStub(
      'https://api.rokka.io/stacks/myorg/mystack',
      td.matchers.contains(expectedArgs),
      td.matchers.anything()
    )
  )
})

test('stacks.createOverwrite', t => {
  const rokka = rka({ apiKey: 'APIKEY' })
  const options = { 'jpg.quality': 76 }
  const operations = [
    rokka.operations.rotate(45),
    rokka.operations.resize(100, 100)
  ]

  rokka.stacks.create(
    'myorg',
    'mystack',
    { operations, options },
    { overwrite: true }
  )

  const expectedArgs = {
    method: 'PUT',
    body: JSON.stringify({ operations, options })
  }

  td.verify(
    requestStub(
      'https://api.rokka.io/stacks/myorg/mystack?overwrite=true',
      td.matchers.contains(expectedArgs),
      td.matchers.anything()
    )
  )
})

test('stacks.createOverwrite (version <=0.26)', t => {
  const rokka = rka({ apiKey: 'APIKEY' })
  const options = { 'jpg.quality': 76 }
  const operations = [
    rokka.operations.rotate(45),
    rokka.operations.resize(100, 100)
  ]

  rokka.stacks.create('myorg', 'mystack', operations, options, true)

  const expectedArgs = {
    method: 'PUT',
    body: JSON.stringify({ operations, options })
  }

  td.verify(
    requestStub(
      'https://api.rokka.io/stacks/myorg/mystack?overwrite=true',
      td.matchers.contains(expectedArgs),
      td.matchers.anything()
    )
  )
})

test('stacks.delete', t => {
  const rokka = rka({ apiKey: 'APIKEY' })

  rokka.stacks.delete('myorg', 'mystack')

  const expectedArgs = {
    method: 'DELETE',
    body: null
  }

  td.verify(
    requestStub(
      'https://api.rokka.io/stacks/myorg/mystack',
      td.matchers.contains(expectedArgs),
      td.matchers.anything()
    )
  )
})
