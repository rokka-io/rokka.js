const expressions = {}

/**
 * ### expressions
 *
 * @module expressions
 */
export default (state) => {
  expressions.default = (expression, options) => {
    return {expression: expression, overrides: {options: options}}
  }

  return {
    expressions
  }
}
