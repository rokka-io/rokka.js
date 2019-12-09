import { rokka, queryAndCheckAnswer } from '../mockServer'

describe('operations', () => {
  it('operations get', async () => {
    await queryAndCheckAnswer(
      async () => rokka({ noAuth: true }).operations.list(),
      {
        mockFile: 'operations_get.json'
      }
    )
  })

  it('known operations functions exists', async () => {
    const knownOperations = [
      'resize',
      'autorotate',
      'rotate',
      'dropshadow',
      'trim',
      'crop',
      'noop',
      'composition',
      'blur'
    ]

    const rka = rokka()

    knownOperations.forEach(key => {
      expect(typeof rka.operations[key] === 'function').toBe(true)
    })
  })
})
