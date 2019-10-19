import test from 'ava'
import td from 'testdouble'

import * as transport from '../../src/transport'

import rka from '../../src'
const requestStub = td.replace(transport, 'default')

test('sourceimages.setSubjectArea', t => {
  const rokka = rka({ apiKey: 'APIKEY' })

  const subjectArea = { x: 100, y: 100, width: 50, height: 50 }

  rokka.sourceimages.setSubjectArea(
    'myorg',
    'c421f4e8cefe0fd3aab22832f51e85bacda0a47a',
    subjectArea
  )

  const expectedArgs = {
    method: 'PUT',
    body: JSON.stringify(subjectArea),
    json: true
  }

  td.verify(
    requestStub(
      'https://api.rokka.io/sourceimages/myorg/c421f4e8cefe0fd3aab22832f51e85bacda0a47a/meta/dynamic/subject_area?deletePrevious=false',
      td.matchers.contains(expectedArgs)
    )
  )
})

test('sourceimages.setSubjectArea.deletePrevious', t => {
  const rokka = rka({ apiKey: 'APIKEY' })

  const subjectArea = { x: 100, y: 100, width: 50, height: 50 }

  rokka.sourceimages.setSubjectArea(
    'myorg',
    'c421f4e8cefe0fd3aab22832f51e85bacda0a47a',
    subjectArea,
    { deletePrevious: true }
  )

  const expectedArgs = {
    method: 'PUT',
    body: JSON.stringify(subjectArea),
    json: true
  }

  td.verify(
    requestStub(
      'https://api.rokka.io/sourceimages/myorg/c421f4e8cefe0fd3aab22832f51e85bacda0a47a/meta/dynamic/subject_area?deletePrevious=true',
      td.matchers.contains(expectedArgs)
    )
  )
})

test('sourceimages.removeSubjectArea', t => {
  const rokka = rka({ apiKey: 'APIKEY' })

  rokka.sourceimages.removeSubjectArea(
    'myorg',
    'c421f4e8cefe0fd3aab22832f51e85bacda0a47a'
  )

  const expectedArgs = {
    method: 'DELETE',
    body: null,
    json: true
  }

  td.verify(
    requestStub(
      'https://api.rokka.io/sourceimages/myorg/c421f4e8cefe0fd3aab22832f51e85bacda0a47a/meta/dynamic/subject_area?deletePrevious=false',
      td.matchers.contains(expectedArgs)
    )
  )
})

test('sourceimages.removeSubjectArea.deletePrevious', t => {
  const rokka = rka({ apiKey: 'APIKEY' })

  rokka.sourceimages.removeSubjectArea(
    'myorg',
    'c421f4e8cefe0fd3aab22832f51e85bacda0a47a',
    { deletePrevious: true }
  )

  const expectedArgs = {
    method: 'DELETE',
    body: null,
    json: true
  }

  td.verify(
    requestStub(
      'https://api.rokka.io/sourceimages/myorg/c421f4e8cefe0fd3aab22832f51e85bacda0a47a/meta/dynamic/subject_area?deletePrevious=true',
      td.matchers.contains(expectedArgs)
    )
  )
})

test('sourceimages.meta.add', t => {
  const rokka = rka({ apiKey: 'APIKEY' })

  const userData = {
    somefield: 'somevalue',
    'int:some_number': 0,
    delete_this: null
  }

  rokka.sourceimages.meta.add(
    'myorg',
    'c421f4e8cefe0fd3aab22832f51e85bacda0a47a',
    userData
  )

  const expectedArgs = {
    method: 'PATCH',
    body: JSON.stringify(userData),
    json: true
  }

  td.verify(
    requestStub(
      'https://api.rokka.io/sourceimages/myorg/c421f4e8cefe0fd3aab22832f51e85bacda0a47a/meta/user',
      td.matchers.contains(expectedArgs)
    )
  )
})

test('sourceimages.meta.replace', t => {
  const rokka = rka({ apiKey: 'APIKEY' })

  const userData = { somefield: 'somevalue', 'int:another_number': 23 }

  rokka.sourceimages.meta.replace(
    'myorg',
    'c421f4e8cefe0fd3aab22832f51e85bacda0a47a',
    userData
  )

  const expectedArgs = {
    method: 'PUT',
    body: JSON.stringify(userData),
    json: true
  }

  td.verify(
    requestStub(
      'https://api.rokka.io/sourceimages/myorg/c421f4e8cefe0fd3aab22832f51e85bacda0a47a/meta/user',
      td.matchers.contains(expectedArgs)
    )
  )
})

test('sourceimages.meta.replace', t => {
  const rokka = rka({ apiKey: 'APIKEY' })

  rokka.sourceimages.meta.delete(
    'myorg',
    'c421f4e8cefe0fd3aab22832f51e85bacda0a47a'
  )

  const expectedArgs = {
    method: 'DELETE',
    body: null,
    json: true
  }

  td.verify(
    requestStub(
      'https://api.rokka.io/sourceimages/myorg/c421f4e8cefe0fd3aab22832f51e85bacda0a47a/meta/user',
      td.matchers.contains(expectedArgs)
    )
  )
})
