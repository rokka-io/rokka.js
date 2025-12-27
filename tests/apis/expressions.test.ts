import { rokka } from '../mockServer'

describe('expressions', () => {
  const rka = rokka()

  describe('expressions.default', () => {
    it('creates an expression with options', () => {
      const result = rka.expressions.default('options.dpr >= 2', {
        width: 200,
        height: 100,
      })

      expect(result).toEqual({
        expression: 'options.dpr >= 2',
        overrides: {
          options: {
            width: 200,
            height: 100,
          },
        },
      })
    })

    it('creates an expression with string options', () => {
      const result = rka.expressions.default('options.format == "webp"', {
        quality: 80,
        format: 'jpg',
      })

      expect(result).toEqual({
        expression: 'options.format == "webp"',
        overrides: {
          options: {
            quality: 80,
            format: 'jpg',
          },
        },
      })
    })

    it('creates an expression with empty options', () => {
      const result = rka.expressions.default('true', {})

      expect(result).toEqual({
        expression: 'true',
        overrides: {
          options: {},
        },
      })
    })

    it('creates an expression with numeric options', () => {
      const result = rka.expressions.default('options.width > 500', {
        width: 250,
        quality: 75,
      })

      expect(result).toEqual({
        expression: 'options.width > 500',
        overrides: {
          options: {
            width: 250,
            quality: 75,
          },
        },
      })
    })

    it('can be used with operations for conditional stacks', () => {
      const operations = [
        rka.operations.resize(100, 100),
        rka.expressions.default('options.dpr >= 2', { width: 200 }),
      ]

      expect(operations).toHaveLength(2)
      expect(operations[0]).toEqual({
        name: 'resize',
        options: { width: 100, height: 100 },
      })
      expect(operations[1]).toEqual({
        expression: 'options.dpr >= 2',
        overrides: {
          options: { width: 200 },
        },
      })
    })
  })
})
