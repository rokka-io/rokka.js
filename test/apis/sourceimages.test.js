import test from 'ava'
import td from 'testdouble'
import stream from 'stream'
import * as transport from '../../src/transport'
import rka from '../../src'

const requestStub = td.replace(transport, 'default')

test('sourceimages.list', t => {
  const rokka = rka({ apiKey: 'APIKEY' })

  rokka.sourceimages.list('myorg')

  const expectedArgs = {
    method: 'GET',
    body: null
  }

  td.verify(
    requestStub(
      'https://api.rokka.io/sourceimages/myorg',
      td.matchers.contains(expectedArgs)
    )
  )
})

test('sourceimages.list with args', t => {
  const rokka = rka({ apiKey: 'APIKEY' })

  const search = {
    'user:int:id': '42',
    height: '64'
  }

  rokka.sourceimages.list('myorg', { search, limit: 23, offset: 23 })

  const expectedArgs = {
    method: 'GET',
    body: null
  }

  td.verify(
    requestStub(
      'https://api.rokka.io/sourceimages/myorg?height=64&limit=23&offset=23&user%3Aint%3Aid=42',
      td.matchers.contains(expectedArgs)
    )
  )
})

test('sourceimages.get', t => {
  const rokka = rka({ apiKey: 'APIKEY' })

  rokka.sourceimages.get('myorg', 'c421f4e8cefe0fd3aab22832f51e85bacda0a47a')

  const expectedArgs = {
    method: 'GET',
    body: null
  }

  td.verify(
    requestStub(
      'https://api.rokka.io/sourceimages/myorg/c421f4e8cefe0fd3aab22832f51e85bacda0a47a',
      td.matchers.contains(expectedArgs)
    )
  )
})

test('sourceimages.getWithBinaryHash', t => {
  const rokka = rka({ apiKey: 'APIKEY' })

  rokka.sourceimages.getWithBinaryHash(
    'myorg',
    'b23e17047329b417d3902dc1a5a7e158a3ee822a'
  )

  const expectedArgs = {
    method: 'GET',
    body: null
  }

  td.verify(
    requestStub(
      'https://api.rokka.io/sourceimages/myorg?binaryHash=b23e17047329b417d3902dc1a5a7e158a3ee822a',
      td.matchers.contains(expectedArgs)
    )
  )
})

test('sourceimages.download', t => {
  const rokka = rka({ apiKey: 'APIKEY' })

  rokka.sourceimages.download(
    'myorg',
    'c421f4e8cefe0fd3aab22832f51e85bacda0a47a'
  )

  const expectedArgs = {
    method: 'GET',
    body: null
  }

  td.verify(
    requestStub(
      'https://api.rokka.io/sourceimages/myorg/c421f4e8cefe0fd3aab22832f51e85bacda0a47a/download',
      td.matchers.contains(expectedArgs)
    )
  )
})

test('sourceimages.create', t => {
  const matchArgs = {
    method: 'POST'
  }

  td.when(
    requestStub(td.matchers.contains(matchArgs), td.matchers.anything())
  ).thenResolve({ statusCode: 200, body: '{}' })

  const expectedArgs = Object.assign({}, matchArgs, {
    // body is a formdata, but hard to check... if anyone knows how, please tell me
    body: {}
  })

  const rokka = rka({ apiKey: 'APIKEY' })

  const mockStream = new stream.Readable()
  mockStream._read = () => true

  const promise = rokka.sourceimages
    .create('myorg', 'picture.png', mockStream)
    .then(() => {
      td.verify(
        requestStub(
          'https://api.rokka.io/sourceimages/myorg',
          td.matchers.contains(expectedArgs)
        )
      )
    })

  mockStream.emit('data', Buffer.from('DATA'))
  mockStream.emit('end')

  return promise
})

test('sourceimages.create with metadata', t => {
  const matchArgs = {
    method: 'POST'
  }

  td.when(
    requestStub(td.matchers.contains(matchArgs), td.matchers.anything())
  ).thenResolve({ statusCode: 200, body: '{}' })

  const expectedArgs = Object.assign({}, matchArgs, {
    // body is a formdata, but hard to check... if anyone knows how, please tell me
    body: {}
  })

  const rokka = rka({ apiKey: 'APIKEY' })

  const mockStream = new stream.Readable()
  mockStream._read = () => true

  const promise = rokka.sourceimages
    .create('myorg', 'picture.png', mockStream, { meta_user: { foo: 'bar' } })
    .then(() => {
      td.verify(
        requestStub(
          'https://api.rokka.io/sourceimages/myorg',
          td.matchers.contains(expectedArgs)
        )
      )
    })

  mockStream.emit('data', Buffer.from('DATA'))
  mockStream.emit('end')

  return promise
})

test('sourceimages.delete', t => {
  const rokka = rka({ apiKey: 'APIKEY' })

  rokka.sourceimages.delete('myorg', 'c421f4e8cefe0fd3aab22832f51e85bacda0a47a')

  const expectedArgs = {
    method: 'DELETE',
    body: null
  }

  td.verify(
    requestStub(
      'https://api.rokka.io/sourceimages/myorg/c421f4e8cefe0fd3aab22832f51e85bacda0a47a',
      td.matchers.contains(expectedArgs)
    )
  )
})

test('sourceimages.restore', t => {
  const rokka = rka({ apiKey: 'APIKEY' })

  rokka.sourceimages.restore(
    'myorg',
    'c421f4e8cefe0fd3aab22832f51e85bacda0a47a'
  )

  const expectedArgs = {
    method: 'POST',
    body: null
  }

  td.verify(
    requestStub(
      'https://api.rokka.io/sourceimages/myorg/c421f4e8cefe0fd3aab22832f51e85bacda0a47a/restore',
      td.matchers.contains(expectedArgs)
    )
  )
})

test('sourceimages.copy', t => {
  const rokka = rka({ apiKey: 'APIKEY' })

  rokka.sourceimages.copy(
    'myorg',
    'c421f4e8cefe0fd3aab22832f51e85bacda0a47a',
    'otherorg'
  )

  const expectedArgs = {
    method: 'COPY',
    body: null,
    headers: { 'Api-Version': 1, 'Api-Key': 'APIKEY', Destination: 'otherorg' }
  }

  td.verify(
    requestStub(
      'https://api.rokka.io/sourceimages/myorg/c421f4e8cefe0fd3aab22832f51e85bacda0a47a',
      td.matchers.contains(expectedArgs)
    )
  )
})

test('sourceimages.copy with no overwrite', t => {
  const rokka = rka({ apiKey: 'APIKEY' })

  rokka.sourceimages.copy(
    'myorg',
    'c421f4e8cefe0fd3aab22832f51e85bacda0a47a',
    'otherorg',
    false
  )

  const expectedArgs = {
    method: 'COPY',
    body: null,
    headers: {
      'Api-Version': 1,
      'Api-Key': 'APIKEY',
      Destination: 'otherorg',
      Overwrite: 'F'
    }
  }

  td.verify(
    requestStub(
      'https://api.rokka.io/sourceimages/myorg/c421f4e8cefe0fd3aab22832f51e85bacda0a47a',
      td.matchers.contains(expectedArgs)
    )
  )
})

test('sourceimages.deleteWithBinaryHash', t => {
  const rokka = rka({ apiKey: 'APIKEY' })

  rokka.sourceimages.deleteWithBinaryHash(
    'myorg',
    'b23e17047329b417d3902dc1a5a7e158a3ee822a'
  )

  const expectedArgs = {
    method: 'DELETE',
    body: null
  }

  td.verify(
    requestStub(
      'https://api.rokka.io/sourceimages/myorg?binaryHash=b23e17047329b417d3902dc1a5a7e158a3ee822a',
      td.matchers.contains(expectedArgs)
    )
  )
})
