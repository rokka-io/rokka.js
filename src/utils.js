import sha1 from 'sha1';

export function signature(secret, url, payload, payloadSigHack) {
  if (payloadSigHack) {
    payload = 'da39a3ee5e6b4b0d3255bfef95601890afd80709';
  } else {
    payload = payload ? sha1(payload) : '';
  }

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
