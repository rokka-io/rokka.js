/**
 * ### expressions
 *
 * @module expressions
 */

export interface Expression {
  expression: string
  overrides: { options: Options }
}

interface Options {
  [key: string]: string | number
}

export class ExpressionsApi {
  default(expression: string, options: Options): Expression {
    return { expression, overrides: { options } }
  }
}

export type Expressions = ExpressionsApi

export default (): { expressions: Expressions } => ({
  expressions: new ExpressionsApi(),
})
