const expressions = {}

/**
 * ### expressions
 *
 * @module expressions
 */
export default (state) => {
  expressions.default = (expression, options) => {
    return { expression, overrides: { options } }
  }

  return {
    expressions
  }
}
