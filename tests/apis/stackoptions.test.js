import { rokka, queryAndCheckAnswer } from '../mockServer'

describe('stackoptions', () => {
  it('stackoptions get', async () => {
    await queryAndCheckAnswer(
      async () => rokka({ noAuth: true }).stackoptions.get(),
      {
        mockFile: 'stackoptions_get.json'
      }
    )
  })
})
