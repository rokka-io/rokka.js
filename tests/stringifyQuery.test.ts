import { stringifyQuery } from '../src/utils'

// Expected values were verified against query-string@7 stringify() before it
// was removed as a dependency.
describe('stringifyQuery', () => {
  it.each([
    [{ b: 1, a: 'x y', c: true }, 'a=x%20y&b=1&c=true'],
    [
      { q: "it's (a) *test*!", u: 'ä/ö?&=#+', e: '' },
      'e=&q=it%27s%20%28a%29%20%2Atest%2A%21&u=%C3%A4%2F%C3%B6%3F%26%3D%23%2B',
    ],
    [{ n: null, u: undefined, z: 0, f: false }, 'f=false&n&z=0'],
    [
      { arr: ['b', 'a', null, undefined, 3], k: 'v' },
      'arr=b&arr=a&arr&arr=3&k=v',
    ],
    [
      { 'key with space': 'v', 'k[0]': 'x', 'search[foo]': 'bar~-._' },
      'k%5B0%5D=x&key%20with%20space=v&search%5Bfoo%5D=bar~-._',
    ],
    [{ emoji: '😀', cr: 'a\nb' }, 'cr=a%0Ab&emoji=%F0%9F%98%80'],
    [{}, ''],
  ])('stringifies %j', (params, expected) => {
    expect(stringifyQuery(params)).toBe(expected)
  })
})
