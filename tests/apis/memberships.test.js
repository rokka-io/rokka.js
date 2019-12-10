import { rokka, queryAndCheckAnswer } from '../mockServer'

describe('memberships', () => {
  it('memberships.ROLES', async () => {
    expect(rokka().memberships.ROLES).toEqual({
      READ: 'read',
      WRITE: 'write',
      UPLOAD: 'upload',
      ADMIN: 'admin'
    })
  })

  it('memberships.createWithNewUser', async () => {
    await queryAndCheckAnswer(
      async () => {
        return rokka().memberships.createWithNewUser('rokka-js-tests', [
          rokka().memberships.ROLES.UPLOAD,
          rokka().memberships.ROLES.READ
        ])
      },
      {
        mockFile: 'memberships_create_with_new_user.json'
      }
    )
  })

  it('memberships.createWithArray', async () => {
    await queryAndCheckAnswer(
      async () => {
        return rokka().memberships.create(
          'rokka-js-tests',
          '679cd7aa-5445-4d6a-8d56-930557a2a77e',
          [rokka().memberships.ROLES.UPLOAD, rokka().memberships.ROLES.WRITE]
        )
      },
      {
        mockFile: 'memberships_create_with_array.json'
      }
    )
  })

  it('memberships.list', async () => {
    await queryAndCheckAnswer(
      async () => rokka().memberships.list('rokka-js-tests'),
      {
        mockFile: 'memberships_list.json'
      }
    )
  })

  it('memberships.delete', async () => {
    await queryAndCheckAnswer(
      async () =>
        rokka().memberships.delete(
          'rokka-js-tests',
          '679cd7aa-5445-4d6a-8d56-930557a2a77e'
        ),
      {
        mockFile: 'memberships_delete.json'
      }
    )
  })
})
