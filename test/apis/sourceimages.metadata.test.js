import test from 'ava'
import td from 'testdouble'

import * as transport from '../../src/transport'
const requestStub = td.replace(transport, 'default')

import rka from '../../src'

test('sourceimages.setSubjectArea', t => {
  const rokka = rka({ apiKey: 'APIKEY' })

  const subjectArea = { x: 100, y: 100, width: 50, height: 50 }

  rokka.sourceimages.setSubjectArea('myorg', 'c421f4e8cefe0fd3aab22832f51e85bacda0a47a', subjectArea)

  const expectedArgs = {
    method: 'PUT',
    uri: 'https://api.rokka.io/sourceimages/myorg/c421f4e8cefe0fd3aab22832f51e85bacda0a47a/meta/dynamic/subject_area',
    body: subjectArea,
    qs: {deletePrevious: 'false'},
    json: true
  }

  td.verify(requestStub(td.matchers.contains(expectedArgs), td.matchers.anything()))
})

test('sourceimages.setSubjectArea.deletePrevious', t => {
  const rokka = rka({ apiKey: 'APIKEY' })

  const subjectArea = { x: 100, y: 100, width: 50, height: 50 }

  rokka.sourceimages.setSubjectArea('myorg', 'c421f4e8cefe0fd3aab22832f51e85bacda0a47a', subjectArea, {deletePrevious: true})

  const expectedArgs = {
    method: 'PUT',
    uri: 'https://api.rokka.io/sourceimages/myorg/c421f4e8cefe0fd3aab22832f51e85bacda0a47a/meta/dynamic/SubjectArea',
    body: subjectArea,
    qs: {deletePrevious: 'true'},
    json: true
  }

  td.verify(requestStub(td.matchers.contains(expectedArgs), td.matchers.anything()))
})

test('sourceimages.removeSubjectArea', t => {
  const rokka = rka({ apiKey: 'APIKEY' })

  rokka.sourceimages.removeSubjectArea('myorg', 'c421f4e8cefe0fd3aab22832f51e85bacda0a47a')

  const expectedArgs = {
    method: 'DELETE',
    uri: 'https://api.rokka.io/sourceimages/myorg/c421f4e8cefe0fd3aab22832f51e85bacda0a47a/meta/dynamic/subject_area',
    body: null,
    qs: null,
    json: true
  }

  td.verify(requestStub(td.matchers.contains(expectedArgs), td.matchers.anything()))
})

test('sourceimages.meta.add', t => {
  const rokka = rka({ apiKey: 'APIKEY' })

  const userData = { somefield: 'somevalue', 'int:some_number': 0, delete_this: null }

  rokka.sourceimages.meta.add('myorg', 'c421f4e8cefe0fd3aab22832f51e85bacda0a47a', userData)

  const expectedArgs = {
    method: 'PATCH',
    uri: 'https://api.rokka.io/sourceimages/myorg/c421f4e8cefe0fd3aab22832f51e85bacda0a47a/meta/user',
    body: userData,
    qs: null,
    json: true
  }

  td.verify(requestStub(td.matchers.contains(expectedArgs), td.matchers.anything()))
})

test('sourceimages.meta.replace', t => {
  const rokka = rka({ apiKey: 'APIKEY' })

  const userData = { somefield: 'somevalue', 'int:another_number': 23 }

  rokka.sourceimages.meta.replace('myorg', 'c421f4e8cefe0fd3aab22832f51e85bacda0a47a', userData)

  const expectedArgs = {
    method: 'PUT',
    uri: 'https://api.rokka.io/sourceimages/myorg/c421f4e8cefe0fd3aab22832f51e85bacda0a47a/meta/user',
    body: userData,
    qs: null,
    json: true
  }

  td.verify(requestStub(td.matchers.contains(expectedArgs), td.matchers.anything()))
})

test('sourceimages.meta.replace', t => {
  const rokka = rka({ apiKey: 'APIKEY' })

  rokka.sourceimages.meta.delete('myorg', 'c421f4e8cefe0fd3aab22832f51e85bacda0a47a')

  const expectedArgs = {
    method: 'DELETE',
    uri: 'https://api.rokka.io/sourceimages/myorg/c421f4e8cefe0fd3aab22832f51e85bacda0a47a/meta/user',
    body: null,
    qs: null,
    json: true
  }

  td.verify(requestStub(td.matchers.contains(expectedArgs), td.matchers.anything()))
})
