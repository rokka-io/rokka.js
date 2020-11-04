import { rokka, queryAndCheckAnswer } from '../mockServer'
describe('users', () => {
  it('users.create', async () => {
    await queryAndCheckAnswer(
      async () =>
        rokka({ noAuth: true }).users.create(
          'user@example.org',
          'rokka-js-tests-new2',
        ),
      {
        mockFile: 'users_create.json',
      },
    )
  })

  it('users.getId', async () => {
    await queryAndCheckAnswer(async () => rokka().users.getId(), {
      mockFile: 'users_getid.json',
    })
  })
})
