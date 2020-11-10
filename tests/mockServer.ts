import nock from 'nock'
import { join } from 'path'
import fs from 'fs'
import rka, { Config } from '../src'
import { RokkaApi } from '../src/apis'

const nockBack = nock.back
nockBack.setMode('record')
nockBack.fixtures = join(__dirname, 'fixtures/requests/')
const responseDir = join(__dirname, 'fixtures/answers/')
// don't save rawHeaders into fixtures. not needed and change too often
const afterRecord = (scopes: object[]) => {
  return (
    scopes
      // don't store local requests to fixtures
      .filter((scope: any) => !scope.scope.match(/127.0.0.1/))
      .map((scope: any) => {
        if (scope.rawHeaders) {
          delete scope.rawHeaders
        }
        return scope
      })
      // sort by path to have less variability in fixtures
      .sort((a, b) => {
        return a.path < b.path ? -1 : 1
      })
  )
}

export const rokka = ({ noAuth = false } = {}): RokkaApi => {
  const config: Config = {
    transport: { retries: 0 },
  }
  if (noAuth !== true) {
    config.apiKey = process.env.API_KEY || 'APIKEY'
  }
  return rka(config)
}

// set to true, in case you need that for some requests
const recorder = { enable_reqheaders_recording: false }

interface Options {
  mockFile?: string
  returnError?: boolean
}

export const query = async (
  call: () => void,
  { mockFile, returnError }: Options = {},
): Promise<any> => {
  let nockRes = null
  if (mockFile) {
    // load fixture
    nockRes = await nockBack(mockFile, { afterRecord, recorder })
  }
  nock.disableNetConnect()
  let response
  try {
    response = await call()
  } catch (e) {
    if (!returnError) {
      throw e
    }
    response = e
  }
  if (mockFile && nockRes) {
    nockRes.nockDone()
  }
  nock.cleanAll()
  return response
}

/* eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types */
export const checkAnswer = (response: any, file: string): any => {
  const filePath = join(responseDir, file)
  let json
  if (fs.existsSync(filePath)) {
    json = JSON.parse(fs.readFileSync(join(responseDir, file)).toString())
    // normalize response
    response = JSON.parse(JSON.stringify(response))
  } else {
    fs.writeFileSync(filePath, JSON.stringify(response, null, 2))
    json = response
  }
  expect(response).toEqual(json)
  return json
}

export const queryAndCheckAnswer = async (
  call: () => void,
  args: Options = {},
): Promise<any> => {
  return query(call, args).then(queryResponse => {
    if (args.mockFile) {
      return checkAnswer(queryResponse, args.mockFile)
    } else {
      throw new Error('No mockFile given, needed for this method')
    }
  })
}
