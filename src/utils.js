export function stringifyOperations (operations) {
  operations = Array.isArray(operations) ? operations : [operations]

  return operations
    .map(operation => {
      const name = operation.name
      const options = Object.keys(operation.options || {})
        .map(k => `${k}-${operation.options[k]}`)
        .join('-')

      if (!options) {
        return name
      }

      return `${name}-${options}`
    })
    .join('--')
}

export function isStream (stream) {
  return (
    stream !== null &&
    typeof stream === 'object' &&
    typeof stream.pipe === 'function'
  )
}
