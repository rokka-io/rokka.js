import { stringifyOperations } from '../utils'
import { State } from '../index'
import sha2_256 from 'simple-js-sha2-256'
import btoa from 'btoa'

type SignUrlWithOptionsType = (
  url: string,
  signKey: string,
  options?: { until?: string } | null
) => string

interface SignUrlOptions {
  until?: Date | null
  roundDateUpTo?: number
}

type SignUrlType = (
  url: string,
  signKey: string,
  options?: SignUrlOptions
) => string

export interface VariablesInterface {
  [key: string]: string | number | boolean
}

type AddStackVariablesType = (
  url: string,
  variables: VariablesInterface,
  removeSafeUrlFromQuery?: boolean
) => string

export interface Render {
  getUrl(
    organization: string,
    hash: string,
    format: string,
    mixed: string | object
  ): string

  signUrl: SignUrlType
  signUrlWithOptions: SignUrlWithOptionsType
  addStackVariables: AddStackVariablesType
}

/**
 * currently only gets variables
 * @param stack
 */
const getStackComponents = (
  stack: string
): { variables: VariablesInterface; stackString: string } => {
  // split by slashes
  // TODO: if we parse operations and options, only the stuff before the first / is a dynamic operation
  // otherwise it's just new options for that operation
  // but we don't parse operations yet, here.

  const slashSplits = stack.split('/')
  const variables: VariablesInterface = {}

  for (let i = 0; i < slashSplits.length; i++) {
    const slashSplit = slashSplits[i]
    // then by --, both are valid seperators here
    const dashSplits = slashSplit.split('--')
    for (let j = 0; j < dashSplits.length; j++) {
      const dashSplit = dashSplits[j]
      // and get the object for the variables (or other "parts", later)
      const [operationName, ...options] = dashSplit.split('-')
      if (operationName === 'v' || operationName === 'variables') {
        let name = ''
        // we have a match, set it to empty
        dashSplits[j] = ''
        for (let k = 0; k < options.length; k++) {
          if (k % 2 === 0) {
            name = options[k]
          } else {
            variables[name] = options[k]
          }
        }
      }
    }
    // put them back together
    slashSplits[i] = dashSplits.filter(dashSplit => dashSplit !== '').join('--')
  }
  const stackString = slashSplits
    .filter(slashSplit => slashSplit !== '')
    .join('/')

  return { variables, stackString }
}

function getUrlComponents(
  urlObject: URL
): { stack: string; hash: string; filename?: string; format: string } | false {
  const stackPattern = '(?<stack>.*([^-]|--)|-*)'
  const hashPattern = '(?<hash>[0-9a-f]{6,40})'
  const filenamePattern = '(?<filename>[A-Za-z-\0-9]+)'
  const formatPattern = '(?<format>.{3,4})'
  const pathPattern = '(?<hash>-.+-)'

  const regExes = [
    new RegExp(
      `/${stackPattern}/${hashPattern}/${filenamePattern}\.${formatPattern}`
    ),
    new RegExp(`/${stackPattern}/${hashPattern}\.${formatPattern}`),
    new RegExp(
      `/${stackPattern}/${pathPattern}/${filenamePattern}\.${formatPattern}`
    ),

    new RegExp(`/${stackPattern}/${pathPattern}\.${formatPattern}`)
  ]

  const path = urlObject.pathname
  let matches = null
  for (let i = 0; i < regExes.length; i++) {
    matches = path.match(regExes[i])
    if (matches) {
      break
    }
  }

  if (matches !== null && matches.groups?.['stack']) {
    return {
      stack: matches.groups['stack'],
      hash: matches.groups['hash'],
      format: matches.groups['format'],
      filename: matches.groups['filename']
    }
  }
  return false
}

const stringifyBool = (value: string | boolean | number): string | number => {
  if (value === false) {
    return 'false'
  }
  if (value === true) {
    return 'true'
  }
  return value
}
/**
 * ### Render
 *
 * @module render
 */
export default (state: State) => {
  const render: Render = {
    /**
     * Get URL for rendering an image.
     *
     * ```js
     * rokka.render.getUrl('myorg', 'c421f4e8cefe0fd3aab22832f51e85bacda0a47a', 'png', 'mystack')
     * ```
     *
     * @param  {string}       organization name
     * @param  {string}       hash         image hash
     * @param  {string}       format       image format: `jpg`, `png` or `gif`
     * @param  {string|array} [mixed]      optional stack name or an array of stack operation objects
     * @return {string}
     */
    getUrl: (organization, hash, format, mixed) => {
      const host = state.renderHost.replace('{organization}', organization)
      const mixedParam = Array.isArray(mixed)
        ? `dynamic/${stringifyOperations(mixed)}` // array of operations
        : mixed // stack name
      const stack = mixedParam || 'dynamic/noop'

      return `${host}/${stack}/${hash}.${format}`
    },

    /**
     * Signs a Rokka URL with an option valid until date.
     *
     * It also rounds up the date to the next 5 minutes (300 seconds) to
     * improve CDN caching, can be changed
     *
     * @param {string}  url The Url to be signed
     * @param {string}  signKey The organinzation's sign key
     * @param {SignUrlOptions} [{until:Date = null, roundDateUpTo:number = 300}] optional options.
     *                  until: Valid until,
     *                  roundDateUpTo: For improved caching, the date can be rounded up by so many seconds (default: 300)
     */
    signUrl: (url, signKey, { until = null, roundDateUpTo = 300 } = {}) => {
      let options = null
      if (until) {
        let until2 = until

        if (roundDateUpTo > 1) {
          until2 = new Date()
          until2.setTime(
            Math.ceil(until.getTime() / (roundDateUpTo * 1000)) *
              (roundDateUpTo * 1000)
          )
        }
        options = { until: until2.toISOString() }
      }
      return render.signUrlWithOptions(url, signKey, options)
    },
    /**
     * Signs a rokka URL with a sign key and optional signature options.
     *
     */
    signUrlWithOptions: (url, signKey, options) => {
      const urlObject = new URL(url)

      // generate sigopts
      if (options) {
        const sigOptsBase64 = btoa(JSON.stringify(options))
        urlObject.searchParams.set('sigopts', sigOptsBase64)
      } else {
        urlObject.searchParams.delete('sigopts')
      }

      // remove sig
      urlObject.searchParams.delete('sig')

      const urlPath = urlObject.pathname + urlObject.search
      const sigString = urlPath + ':' + signKey
      const hash = sha2_256(sigString)

      // append new sig
      urlObject.searchParams.append('sig', hash.substring(0, 16))
      return urlObject.toString()
    },

    addStackVariables: (
      url,
      variables,
      removeSafeUrlFromQuery = false
    ): string => {
      const urlObject = new URL(url)

      const urlComponents = getUrlComponents(urlObject)

      if (!urlComponents) {
        return url
      }

      const stackComponents = getStackComponents(urlComponents.stack)

      const variablesFromPath = stackComponents.variables
      const vQuery = urlObject.searchParams.get('v')
      const vQueryParsed: VariablesInterface =
        vQuery !== null ? JSON.parse(vQuery) : {}

      const returnVariables = Object.assign(
        variablesFromPath,
        vQueryParsed,
        variables
      )

      // put variales into url string or v parameter, depending on characters in it
      if (Object.keys(returnVariables).length > 0) {
        const jsonVariables: VariablesInterface = {}
        let urlVariables = ''
        for (const name in returnVariables) {
          const value = returnVariables[name]
          if (value || value === false) {
            const valueAsString = value.toString()
            // if there's a special var in the value, put it into the v query parameter
            if (valueAsString.match(/[$/\\\-#%&?;]/)) {
              jsonVariables[name] = stringifyBool(value)
            } else {
              urlVariables += '-' + name + '-' + stringifyBool(value)
            }
          }
        }
        if (urlVariables !== '') {
          stackComponents.stackString += '/v' + urlVariables
        }
        if (Object.keys(jsonVariables).length > 0) {
          urlObject.searchParams.set('v', JSON.stringify(jsonVariables))
        } else {
          urlObject.searchParams.delete('v')
        }
      }

      urlObject.pathname =
        stackComponents.stackString +
        '/' +
        urlComponents.hash +
        (urlComponents.filename ? '/' + urlComponents.filename : '') +
        '.' +
        urlComponents.format

      // remove url safe characters on demand for "nicer" urls in demos and such
      if (removeSafeUrlFromQuery) {
        const query = urlObject.search
        urlObject.search = ''

        return (
          urlObject.toString() +
          query
            .replace(/%22/g, '"')
            .replace(/%20/g, ' ')
            .replace(/%2C/g, ',')
            .replace(/%7B/g, '{')
            .replace(/%7D/g, '}')
            .replace(/%3A/g, ':')
        )
      }

      return urlObject.toString()
    }
  }

  return {
    render
  }
}
