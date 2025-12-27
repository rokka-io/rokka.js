import rokka, { Rokka } from '../src'
import apis from '../src/apis'

// Mock the apis module to return an object with all required properties
jest.mock('../src/apis', () => {
  const mockFn = jest.fn(() => ({
    billing: {},
    expressions: {},
    memberships: {},
    operations: {},
    organizations: {},
    render: {},
    sourceimages: {},
    stackoptions: {},
    stacks: {},
    stats: {},
    users: {},
    user: {},
    utils: {},
    request: {},
  }))
  return {
    __esModule: true,
    default: mockFn,
  }
})

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
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
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
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
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
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    expect(apis.mock.calls[2][0].transportOptions).toMatchObject(
      transportOptions,
    )
  })
})

describe('Rokka class', () => {
  beforeEach(() => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    apis.mockClear()
  })

  it('should initialize with default options', () => {
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
    new Rokka()
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    expect(apis.mock.calls[0][0]).toMatchObject(expectedState)
  })

  it('should initialize with custom options', () => {
    const customOptions = {
      apiKey: 'APIKEY',
      apiHost: 'https://api.example.org',
      renderHost: 'https://{organization}.example.org',
      apiVersion: 2,
    }

    new Rokka(customOptions)
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    expect(apis.mock.calls[0][0]).toMatchObject(customOptions)
  })

  it('should initialize with custom transport options', () => {
    const transportOptions = {
      retries: 23,
      minTimeout: 2323,
      maxTimeout: 232323,
      randomize: false,
    }

    new Rokka({ transport: transportOptions })
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    expect(apis.mock.calls[0][0].transportOptions).toMatchObject(
      transportOptions,
    )
  })

  it('should be equivalent to factory function', () => {
    const config = { apiKey: 'test-key' }

    // Both should produce the same state
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    apis.mockClear()
    new Rokka(config)
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const classState = apis.mock.calls[0][0]

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    apis.mockClear()
    rokka(config)
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const factoryState = apis.mock.calls[0][0]

    expect(classState).toMatchObject({
      apiKey: factoryState.apiKey,
      apiHost: factoryState.apiHost,
      renderHost: factoryState.renderHost,
      apiVersion: factoryState.apiVersion,
    })
  })
})
