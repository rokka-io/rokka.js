import test from 'ava'
import td from 'testdouble'
import stream from 'stream'

import * as transport from '../../src/transport'
const requestStub = td.replace(transport, 'default')

import rka from '../../src'

test('sourceimages.list', t => {
  const rokka = rka({ apiKey: 'APIKEY' })

  rokka.sourceimages.list('myorg')

  const expectedArgs = {
    method: 'GET',
    uri: 'https://api.rokka.io/sourceimages/myorg',
    body: null,
    qs: {}
  }

  td.verify(requestStub(td.matchers.contains(expectedArgs), td.matchers.anything()))
})

test('sourceimages.list with args', t => {
  const rokka = rka({ apiKey: 'APIKEY' })

  const search = {
    'user:int:id': '42',
    'height': '64'
  }

  rokka.sourceimages.list('myorg', { search, limit: 23, offset: 23 })

  const expectedArgs = {
    method: 'GET',
    uri: 'https://api.rokka.io/sourceimages/myorg',
    body: null,
    qs: Object.assign({}, search, { limit: 23, offset: 23 })
  }

  td.verify(requestStub(td.matchers.contains(expectedArgs), td.matchers.anything()))
})

test('sourceimages.get', t => {
  const rokka = rka({ apiKey: 'APIKEY' })

  rokka.sourceimages.get('myorg', 'c421f4e8cefe0fd3aab22832f51e85bacda0a47a')

  const expectedArgs = {
    method: 'GET',
    uri: 'https://api.rokka.io/sourceimages/myorg/c421f4e8cefe0fd3aab22832f51e85bacda0a47a',
    body: null,
    qs: null
  }

  td.verify(requestStub(td.matchers.contains(expectedArgs), td.matchers.anything()))
})

test('sourceimages.getWithBinaryHash', t => {
  const rokka = rka({ apiKey: 'APIKEY' })

  rokka.sourceimages.getWithBinaryHash('myorg', 'b23e17047329b417d3902dc1a5a7e158a3ee822a')

  const expectedArgs = {
    method: 'GET',
    uri: 'https://api.rokka.io/sourceimages/myorg',
    qs: { binaryHash: 'b23e17047329b417d3902dc1a5a7e158a3ee822a' },
    body: null
  }

  td.verify(requestStub(td.matchers.contains(expectedArgs), td.matchers.anything()))
})

test('sourceimages.download', t => {
  const rokka = rka({ apiKey: 'APIKEY' })

  rokka.sourceimages.download('myorg', 'c421f4e8cefe0fd3aab22832f51e85bacda0a47a')

  const expectedArgs = {
    method: 'GET',
    uri: 'https://api.rokka.io/sourceimages/myorg/c421f4e8cefe0fd3aab22832f51e85bacda0a47a/download',
    qs: null,
    body: null
  }

  td.verify(requestStub(td.matchers.contains(expectedArgs), td.matchers.anything()))
})

test('sourceimages.create', t => {
  const matchArgs = {
    method: 'POST',
    uri: 'https://api.rokka.io/sourceimages/myorg',
    formData: {}
  }

  td.when(requestStub(td.matchers.contains(matchArgs), td.matchers.anything()))
    .thenResolve({ statusCode: 200, body: '{}' })

  const expectedArgs = Object.assign({}, matchArgs, {
    qs: null,
    formData: {
      filedata: {
        value: new Buffer('DATA'),
        options: { filename: 'picture.png' }
      }
    }
  })

  const rokka = rka({ apiKey: 'APIKEY' })

  const mockStream = new stream.Readable()
  mockStream._read = () => true

  const promise = rokka.sourceimages.create('myorg', 'picture.png', mockStream)
    .then(() => {
      td.verify(requestStub(td.matchers.contains(expectedArgs), td.matchers.anything()))
    })

  mockStream.emit('data', new Buffer('DATA'))
  mockStream.emit('end')

  return promise
})

test('sourceimages.create with metata', t => {
  const matchArgs = {
    method: 'POST',
    uri: 'https://api.rokka.io/sourceimages/myorg',
    formData: {'meta_user[0]': {'foo': 'bar'}}
  }

  td.when(requestStub(td.matchers.contains(matchArgs), td.matchers.anything()))
    .thenResolve({ statusCode: 200, body: '{}' })

  const expectedArgs = Object.assign({}, matchArgs, {
    qs: null,
    formData: {
      filedata: {
        value: new Buffer('DATA'),
        options: { filename: 'picture.png' }
      }
    }
  })

  const rokka = rka({ apiKey: 'APIKEY' })

  const mockStream = new stream.Readable()
  mockStream._read = () => true

  const promise = rokka.sourceimages.create('myorg', 'picture.png', mockStream, {'meta_user': {'foo': 'bar'}})
    .then(() => {
      td.verify(requestStub(td.matchers.contains(expectedArgs), td.matchers.anything()))
    })

  mockStream.emit('data', new Buffer('DATA'))
  mockStream.emit('end')

  return promise
})

test('sourceimages.delete', t => {
  const rokka = rka({ apiKey: 'APIKEY' })

  rokka.sourceimages.delete('myorg', 'c421f4e8cefe0fd3aab22832f51e85bacda0a47a')

  const expectedArgs = {
    method: 'DELETE',
    uri: 'https://api.rokka.io/sourceimages/myorg/c421f4e8cefe0fd3aab22832f51e85bacda0a47a',
    qs: null,
    body: null
  }

  td.verify(requestStub(td.matchers.contains(expectedArgs), td.matchers.anything()))
})

test('sourceimages.restore', t => {
  const rokka = rka({ apiKey: 'APIKEY' })

  rokka.sourceimages.restore('myorg', 'c421f4e8cefe0fd3aab22832f51e85bacda0a47a')

  const expectedArgs = {
    method: 'POST',
    uri: 'https://api.rokka.io/sourceimages/myorg/c421f4e8cefe0fd3aab22832f51e85bacda0a47a/restore',
    qs: null,
    body: null
  }

  td.verify(requestStub(td.matchers.contains(expectedArgs), td.matchers.anything()))
})

test('sourceimages.copy', t => {
  const rokka = rka({ apiKey: 'APIKEY' })

  rokka.sourceimages.copy('myorg', 'c421f4e8cefe0fd3aab22832f51e85bacda0a47a', 'otherorg')

  const expectedArgs = {
    method: 'COPY',
    uri: 'https://api.rokka.io/sourceimages/myorg/c421f4e8cefe0fd3aab22832f51e85bacda0a47a',
    qs: null,
    body: null,
    headers: {'Api-Version': 1, 'Api-Key': 'APIKEY', 'Destination': 'otherorg'}
  }

  td.verify(requestStub(td.matchers.contains(expectedArgs), td.matchers.anything()))
})

test('sourceimages.copy with no overwrite', t => {
  const rokka = rka({ apiKey: 'APIKEY' })

  rokka.sourceimages.copy('myorg', 'c421f4e8cefe0fd3aab22832f51e85bacda0a47a', 'otherorg', false)

  const expectedArgs = {
    method: 'COPY',
    uri: 'https://api.rokka.io/sourceimages/myorg/c421f4e8cefe0fd3aab22832f51e85bacda0a47a',
    qs: null,
    body: null,
    headers: {'Api-Version': 1, 'Api-Key': 'APIKEY', 'Destination': 'otherorg', 'Overwrite': 'F'}
  }

  td.verify(requestStub(td.matchers.contains(expectedArgs), td.matchers.anything()))
})

test('sourceimages.deleteWithBinaryHash', t => {
  const rokka = rka({ apiKey: 'APIKEY' })

  rokka.sourceimages.deleteWithBinaryHash('myorg', 'b23e17047329b417d3902dc1a5a7e158a3ee822a')

  const expectedArgs = {
    method: 'DELETE',
    uri: 'https://api.rokka.io/sourceimages/myorg',
    qs: { binaryHash: 'b23e17047329b417d3902dc1a5a7e158a3ee822a' },
    body: null
  }

  td.verify(requestStub(td.matchers.contains(expectedArgs), td.matchers.anything()))
})
