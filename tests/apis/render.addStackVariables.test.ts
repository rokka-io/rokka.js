import { rokka } from '../mockServer'
const rootUrl = 'http://test.rokka.test/template3/'
const hash = 'abcdef.png'
describe('addStackVariables', () => {
  const rka = rokka()

  test.each`
    description                            | url                        | variables       | cleanerUrl | expectedResult
    ${'Add url variable'}                  | ${hash}                    | ${{ a: 'b' }}   | ${false}   | ${`v-a-b/${hash}`}
    ${'Replace url variable'}              | ${`v-a-b/${hash}`}         | ${{ a: 'c' }}   | ${false}   | ${`v-a-c/${hash}`}
    ${'Variable special char'}             | ${`v-a-b/${hash}`}         | ${{ a: '#' }}   | ${false}   | ${`${hash}?v=%7B%22a%22%3A%22%23%22%7D`}
    ${'Variable special char cleaner url'} | ${`v-a-b/${hash}`}         | ${{ a: '#' }}   | ${true}    | ${`${hash}?v={"a":"%23"}`}
    ${'Double variables definition'}       | ${`v-a-b--v-d-e/${hash}`}  | ${{ a: 'c' }}   | ${false}   | ${`v-a-c-d-e/${hash}`}
    ${'With Seo'}                          | ${`v-a-b/abcdef/foo.png`}  | ${{ a: 'c' }}   | ${false}   | ${`v-a-c/abcdef/foo.png`}
    ${'With options'}                      | ${`v-a-b/o-af-1/${hash}`}  | ${{ a: 'c' }}   | ${false}   | ${`o-af-1/v-a-c/${hash}`}
    ${'With options and empty vars'}       | ${`v-a-b/o-af-1/${hash}`}  | ${{}}           | ${false}   | ${`o-af-1/v-a-b/${hash}`}
    ${'With existing query '}              | ${`${hash}?foo=bar`}       | ${{ a: 'd' }}   | ${false}   | ${`v-a-d/${hash}?foo=bar`}
    ${'With existing and special chars '}  | ${`${hash}?foo=bar`}       | ${{ a: '\\k' }} | ${false}   | ${`${hash}?foo=bar&v=%7B%22a%22%3A%22%5C%5Ck%22%7D`}
    ${'From special to not'}               | ${`${hash}?v={"a":"%23"}`} | ${{ a: 'q a' }} | ${false}   | ${`v-a-q%20a/${hash}`}
  `(
    '$description: converts $url to $expectedResult with $variables',
    ({ url, variables, cleanerUrl, expectedResult }) => {
      expect(
        rka.render.addStackVariables(`${rootUrl}${url}`, variables, cleanerUrl),
      ).toBe(`${rootUrl}${expectedResult}`)
    },
  )
})
