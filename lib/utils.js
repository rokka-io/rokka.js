import sha1 from 'sha1';

export function signature (secret, url, payload) {
  payload = payload ? JSON.stringify(payload) : '';

  return sha1(secret + url + payload);
};
