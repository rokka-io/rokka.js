/**
 * ### expressions
 *
 * @module expressions
 */

export interface Expressions {
  default(expression: string, options: Options): Expression
}

export interface Expression {
  expression: string
  overrides: { options: Options }
}
interface Options {
  [key: string]: string | number
}

export default () => {
  const expressions = {
    default: (expression: string, options: Options): Expression => {
      return { expression, overrides: { options } }
    },
  }
  return {
    expressions,
  }
}
