import { rokka, queryAndCheckAnswer } from '../mockServer'

describe('stats', () => {
  it('stats get', async () => {
    await queryAndCheckAnswer(
      async () => {
        return rokka().stats.get('rokka-js-tests', '2019-11-01', '2019-11-30')
      },
      {
        mockFile: 'stats_get.json',
      },
    )
  })
})
