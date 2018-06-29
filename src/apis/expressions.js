
/**
 * ### expressions
 *
 * @module expressions
 */
export default (state) => {
  const expressions = {}

  expressions.default = (expression, options) => {
    return { expression, overrides: { options } }
  }

  return {
    expressions
  }
}
