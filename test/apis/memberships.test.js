import test from 'ava'
import td from 'testdouble'

import * as transport from '../../src/transport'

import rka from '../../src'

const requestStub = td.replace(transport, 'default')

test('memberships.ROLES', t => {
  const rokka = rka()
  t.deepEqual(rokka.memberships.ROLES, {
    READ: 'read',
    WRITE: 'write',
    UPLOAD: 'upload',
    ADMIN: 'admin'
  })
})

test('memberships.createWithArray', t => {
  const rokka = rka({ apiKey: 'APIKEY' })

  rokka.memberships.create('myorg', 'user@example.org', [
    rokka.memberships.ROLES.UPLOAD,
    rokka.memberships.ROLES.READ
  ])
  const expectedArgs = {
    method: 'PUT',
    body: { roles: ['upload', 'read'] }
  }

  td.verify(
    requestStub(
      'https://api.rokka.io/organizations/myorg/memberships/user@example.org',
      td.matchers.contains(expectedArgs),
      td.matchers.anything()
    )
  )
})

test('memberships.delete', t => {
  const rokka = rka({ apiKey: 'APIKEY' })

  rokka.memberships.delete('myorg', 'user@example.org')

  const expectedArgs = {
    method: 'DELETE'
  }

  td.verify(
    requestStub(
      'https://api.rokka.io/organizations/myorg/memberships/user@example.org',
      td.matchers.contains(expectedArgs),
      td.matchers.anything()
    )
  )
})

test('memberships.createWithNewUser', t => {
  const rokka = rka({ apiKey: 'APIKEY' })

  rokka.memberships.createWithNewUser('myorg', [
    rokka.memberships.ROLES.UPLOAD,
    rokka.memberships.ROLES.READ
  ])

  const expectedArgs = {
    method: 'POST',
    body: { roles: ['upload', 'read'] }
  }

  td.verify(
    requestStub(
      'https://api.rokka.io/organizations/myorg/memberships',
      td.matchers.contains(expectedArgs),
      td.matchers.anything()
    )
  )
})

test('memberships.list', t => {
  const rokka = rka({ apiKey: 'APIKEY' })

  rokka.memberships.list('myorg')

  const expectedArgs = {
    method: 'GET'
  }

  td.verify(
    requestStub(
      'https://api.rokka.io/organizations/myorg/memberships',
      td.matchers.contains(expectedArgs),
      td.matchers.anything()
    )
  )
})
