import sha1 from 'sha1';

export function signature(secret, url, payload) {
  payload = payload ? sha1(JSON.stringify(payload)) : '';

  return sha1(secret + url + payload);
}

export function stringifyOperations(operations) {
  operations = Array.isArray(operations) ? operations : [operations];

  return operations.map((operation) => {
    const name = operation.name;
    const options = Object.keys(operation.options || {})
      .map((k) => `${k}-${operation.options[k]}`).join('-');

    if (!options) {
      return name;
    }

    return `${name}-${options}`;
  }).join('--');
}
