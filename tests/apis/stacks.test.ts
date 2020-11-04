import { queryAndCheckAnswer, rokka } from '../mockServer'

describe('stacks', () => {
  it('stacks.list', async () => {
    await queryAndCheckAnswer(
      async () => rokka().stacks.list('rokka-js-tests'),
      {
        mockFile: 'stacks_list.json',
      },
    )
  })

  it('stacks.get', async () => {
    await queryAndCheckAnswer(
      async () => rokka().stacks.get('rokka-js-tests', 'mystack'),
      {
        mockFile: 'stacks_get.json',
      },
    )
  })

  it('stacks.create', async () => {
    await queryAndCheckAnswer(
      async () => {
        const options = { 'jpg.quality': 77 }
        const operations = [
          rokka().operations.rotate(45),
          rokka().operations.resize(100, 100),
        ]

        return rokka().stacks.create('rokka-js-tests', 'mystack', {
          operations: operations,
          options: options,
        })
      },
      {
        mockFile: 'stacks_create.json',
      },
    )
  })

  it('stacks.create (version <=0.26)', async () => {
    await queryAndCheckAnswer(
      async () => {
        const options = { 'jpg.quality': 76 }
        const operations = [
          rokka().operations.rotate(47),
          rokka().operations.resize(120, 120),
        ]

        return rokka().stacks.create(
          'rokka-js-tests',
          'mystack026',
          operations,
          options,
        )
      },
      {
        mockFile: 'stacks_create_0_26.json',
      },
    )
  })

  it('stacks.create (with expressions)', async () => {
    await queryAndCheckAnswer(
      async () => {
        const options = { 'jpg.quality': 78 }
        const operations = [
          rokka().operations.rotate(45),
          rokka().operations.resize(100, 100),
        ]
        const expressions = [
          rokka().expressions.default('options.dpr >= 2', {
            'jpg.quality': 60,
            'webp.quality': 60,
          }),
        ]
        return rokka().stacks.create('rokka-js-tests', 'mystack_expressions', {
          operations,
          options,
          expressions,
        })
      },
      {
        mockFile: 'stacks_create_expressions.json',
      },
    )
  })
  it('stacks.createOverwrite', async () => {
    await queryAndCheckAnswer(
      async () => {
        const options = { 'jpg.quality': 76 }
        const operations = [
          rokka().operations.rotate(45),
          rokka().operations.resize(100, 100),
        ]

        return rokka().stacks.create(
          'rokka-js-tests',
          'mystack',
          { operations, options },
          { overwrite: true },
        )
      },
      {
        mockFile: 'stacks_create_overwrite.json',
      },
    )
  })

  it('stacks.createOverwrite (version <=0.26)', async () => {
    await queryAndCheckAnswer(
      async () => {
        const options = { 'jpg.quality': 77 }
        const operations = [
          rokka().operations.rotate(48),
          rokka().operations.resize(120, 120),
        ]

        return rokka().stacks.create(
          'rokka-js-tests',
          'mystack',
          operations,
          options,
          true,
        )
      },
      {
        mockFile: 'stacks_create_overwrite_0_26.json',
      },
    )
  })

  it('stacks.delete', async () => {
    await queryAndCheckAnswer(
      async () => rokka().stacks.delete('rokka-js-tests', 'mystack'),
      {
        mockFile: 'stacks_delete.json',
      },
    )
  })
})
