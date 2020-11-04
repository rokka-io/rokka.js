import { rokka, queryAndCheckAnswer } from '../mockServer'
describe('organizations', () => {
  it('organizations.get', async () => {
    await queryAndCheckAnswer(
      async () => rokka().organizations.get('rokka-js-tests'),
      {
        mockFile: 'organizations_get.json',
      },
    )
  })

  it('organizations.create', async () => {
    await queryAndCheckAnswer(
      async () =>
        rokka().organizations.create(
          'rokka-js-test-new',
          'billing@example.org',
          'Organization Inc.',
        ),
      {
        mockFile: 'organizations_create.json',
      },
    )
  })
})
