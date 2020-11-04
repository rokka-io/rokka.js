import rokka from '../src'
import apis from '../src/apis'
jest.mock('../src/apis')

describe('options', () => {
  it('default options', () => {
    const expectedState = {
      apiKey: undefined,
      apiHost: 'https://api.rokka.io',
      renderHost: 'https://{organization}.rokka.io',
      apiVersion: 1,
      transportOptions: {
        factor: 2,
        maxTimeout: 10000,
        minTimeout: 1000,
        randomize: true,
        requestTimeout: 30000,
        retries: 10,
      },
    }
    rokka()
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    expect(apis.mock.calls[0][0]).toMatchObject(expectedState)
  })

  it('custom options', () => {
    const customOptions = {
      apiKey: 'APIKEY',
      apiHost: 'https://api.example.org',
      renderHost: 'https://{organization}.example.org',
      apiVersion: 2,
    }

    rokka(customOptions)
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    expect(apis.mock.calls[1][0]).toMatchObject(customOptions)
  })

  it('custom transport options', () => {
    const transportOptions = {
      retries: 23,
      minTimeout: 2323,
      maxTimeout: 232323,
      randomize: false,
    }

    rokka({ transport: transportOptions })
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    expect(apis.mock.calls[2][0].transportOptions).toMatchObject(
      transportOptions,
    )
  })
})
