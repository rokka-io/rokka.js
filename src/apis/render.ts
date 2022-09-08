import { stringifyOperations } from '../utils'
import { RequestQueryParams, State } from '../index'
import sha2_256 from 'simple-js-sha2-256'
import { RokkaResponse } from '../response'

type SignUrlWithOptionsType = (
  url: string,
  signKey: string,
  options?: { until?: string } | null,
) => string

export interface SignUrlOptions {
  until?: Date | null
  roundDateUpTo?: number
}

export type SignUrlType = (
  url: string,
  signKey: string,
  options?: SignUrlOptions,
) => string

export interface VariablesInterface {
  [key: string]: string | number | boolean
}

type AddStackVariablesType = (
  url: string,
  variables: VariablesInterface,
  removeSafeUrlFromQuery?: boolean,
) => string

export interface UrlComponents {
  stack: string
  hash: string
  filename?: string
  format: string
}

type GetUrlComponentsType = (urlObject: URL) => UrlComponents | false

interface ImagesByAlbumOptions {
  favorites?: boolean
}

export interface Render {
  getUrl(
    organization: string,
    hash: string,
    format: string,
    mixed: string | object,
    options?: { filename?: string },
  ): string
  imagesByAlbum: (
    organization: string,
    album: string,
    options?: ImagesByAlbumOptions | undefined,
  ) => Promise<RokkaResponse>
  signUrl: SignUrlType
  signUrlWithOptions: SignUrlWithOptionsType
  addStackVariables: AddStackVariablesType
  getUrlComponents: GetUrlComponentsType
}

// currently only gets stack variables
const getStackComponents = (
  stack: string,
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

const getUrlComponents: GetUrlComponentsType = (urlObject: URL) => {
  const stackPattern = '(?<stack>.*([^-]|--)|-*)'
  const hashPattern = '(?<hash>[0-9a-f]{6,40})'
  const filenamePattern = '(?<filename>[^\\/^.]+)'
  const formatPattern = '(?<format>.{2,4})'
  const pathPattern = '(?<hash>-.+-)'

  const regExes = [
    new RegExp(
      `/${stackPattern}/${hashPattern}/${filenamePattern}\.${formatPattern}`,
    ),
    new RegExp(`/${stackPattern}/${hashPattern}\.${formatPattern}`),
    new RegExp(
      `/${stackPattern}/${pathPattern}/${filenamePattern}\.${formatPattern}`,
    ),

    new RegExp(`/${stackPattern}/${pathPattern}\.${formatPattern}`),
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
      filename: matches.groups['filename'],
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
export default (state: State): { render: Render } => {
  const render: Render = {
    /**
     * Get URL for rendering an image.
     *
     * ```js
     * rokka.render.getUrl('myorg', 'c421f4e8cefe0fd3aab22832f51e85bacda0a47a', 'png', 'mystack')
     * ```
     *
     * @param  {string}                     organization name
     * @param  {string}                      hash        image hash
     * @param  {string}                      format      image format: `jpg`, `png` or `gif`
     * @param  {string|array}                [mixed]     optional stack name or an array of stack operation objects
     * @param  {{filename:string|undefined}} options     Optional. filename: Adds the filename to the URL
     * @return {string}
     */
    getUrl: (organization, hash, format, mixed, options) => {
      const host = state.renderHost.replace('{organization}', organization)
      const mixedParam = Array.isArray(mixed)
        ? `dynamic/${stringifyOperations(mixed)}` // array of operations
        : mixed // stack name
      const stack = mixedParam || 'dynamic/noop'

      if (options?.filename) {
        hash = `${hash}/${options.filename}`
      }
      return `${host}/${stack}/${hash}.${format}`
    },

    /**
     * Get image hashes and some other info belonging to a album (from metadata: user:array:albums)
     * ```js
     * rokka.render.imagesByAlbum('myorg', 'Albumname', { favorites })
     * ```
     *
     * @param {string}               organization  name
     * @param {string }              album         albumname
     * @param {{favorites:boolean}}  options       Optional options
     */
    imagesByAlbum: (organization, album, options): Promise<RokkaResponse> => {
      const host = state.renderHost.replace('{organization}', organization)

      let filename = 'all'
      if (options?.favorites) {
        filename = 'favorites'
      }
      return state.request(
        'GET',
        `_albums/${album}/${filename}.json`,
        null,
        undefined,
        {
          host,
          noAuthHeaders: true,
          noTokenRefresh: true,
        },
      )
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
     * @return {string}
     */
    signUrl: (url, signKey, { until = null, roundDateUpTo = 300 } = {}) => {
      let options = null
      if (until) {
        let until2 = until

        if (roundDateUpTo > 1) {
          until2 = new Date()
          until2.setTime(
            Math.ceil(until.getTime() / (roundDateUpTo * 1000)) *
              (roundDateUpTo * 1000),
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
        urlObject.searchParams.set('sigopts', JSON.stringify(options))
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

    /**
     * Adds stack variables to a rokka URL in a safe way
     *
     * Uses the v query parameter, if a variable shouldn't be in the path
     *
     * @param {string} url                    The url the stack variables are added to
     * @param {object} variables              The variables to add
     * @param {bool}   [removeSafeUrlFromQuery=false] If true, removes some safe characters from the query
     * @return {string}
     */
    addStackVariables: (
      url,
      variables,
      removeSafeUrlFromQuery = false,
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
        variables,
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
    },
    /**
     * Get rokka components from an URL object.
     *
     * Returns false, if it could not parse it as rokka URL.
     *
     * @param {URL} urlObject
     * @return  {UrlComponents|false}
     */
    getUrlComponents: getUrlComponents,
  }

  return {
    render,
  }
}
