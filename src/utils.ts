import { StackOperation } from './apis/stacks'

export function stringifyOperations(
  operations: StackOperation | StackOperation[]
) {
  const stackoperations: StackOperation[] = Array.isArray(operations)
    ? operations
    : [operations]

  return stackoperations
    .map(operation => {
      const name = operation.name
      const options = Object.keys(operation.options || {})
        .map(
          k =>
            `${k}-${
              operation.options && operation.options[k]
                ? operation.options[k]
                : '__undefined__'
            }`
        )
        .join('-')

      if (!options) {
        return name
      }

      return `${name}-${options}`
    })
    .join('--')
}

export function isStream(stream: any) {
  return (
    stream !== null &&
    typeof stream === 'object' &&
    typeof stream.pipe === 'function'
  )
}
