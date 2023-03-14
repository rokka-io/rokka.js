import { State } from '../index'
import sha2_256 from 'simple-js-sha2-256'
import { RokkaResponse } from '../response'
import {
  getUrlFromUrl,
  getUrl,
  AddStackVariablesType,
  GetUrlOptions,
  GetUrlFromUrlOptions,
  GetUrlComponentsType,
  addStackVariables,
} from 'rokka-render'

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

interface ImagesByAlbumOptions {
  favorites?: boolean
}

export interface Render {
  getUrl(
    organization: string,
    hash: string,
    format: string,
    stack: string | object,
    options?: GetUrlOptions,
  ): string
  getUrlFromUrl(
    rokkaUrl: string,
    stack: string | object,
    options?: GetUrlFromUrlOptions,
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
     * If you just need this function in a browser, you can also use [rokka-render.js](https://github.com/rokka-io/rokka-render.js)
     *
     * ```js
     * rokka.render.getUrl('myorg', 'c421f4e8cefe0fd3aab22832f51e85bacda0a47a', 'png', 'mystack')
     * ```
     *
     * @param  {string}                     organization name
     * @param  {string}                      hash        image hash
     * @param  {string}                      format      image format: `jpg`, `png` or `gif`
     * @param  {string|array}                [stack]     optional stack name or an array of stack operation objects
     * @param  {{filename:string|undefined, stackoptions: StackOptions|undefined, variables: VariablesInterface|undefined, clearVariables:boolean|undefined, removeSafeUrlFromQuery: boolean|undefined}} options     Optional. filename: Adds the filename to the URL, stackoptions: Adds stackoptions to the URL
     * @return {string}
     */
    getUrl: (organization, hash, format, stack, options) => {
      return getUrl(
        organization,
        hash,
        format,
        stack,
        options,
        state.renderHost,
      )
    },

    /**
     * Get URL for rendering an image from a rokka render URL.
     *
     * If you just need this function in a browser, you can also use [rokka-render.js](https://github.com/rokka-io/rokka-render.js)
     *
     * ```js
     * rokka.render.getUrlFromUrl('https://myorg.rokka.io/dynamic/c421f4e8cefe0fd3aab22832f51e85bacda0a47a.png', 'mystack')
     * ```
     *
     * @param  {string}                      rokkaUrl    rokka render URL
     * @param  {string|array}                stack       stack name or an array of stack operation objects
     * @param  {{filename:string|undefined, stackoptions: StackOptions|undefined, format: string|undefined, variables: VariablesInterface|undefined, clearVariables:boolean|undefined, removeSafeUrlFromQuery: boolean|undefined}} options     Optional. filename: Adds or changes the filename to the URL, stackoptions: Adds stackoptions to the URL, format: Changes the format
     * @return {string}
     */
    getUrlFromUrl: (
      rokkaUrl: string,
      stack: string | object,
      options: GetUrlFromUrlOptions = {},
    ): string => {
      return getUrlFromUrl(rokkaUrl, stack, options, state.renderHost)
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

      // remove filename if one exists, not needed for signature
      const components = getUrlComponents(urlObject)
      if (components && components.filename) {
        const regex = new RegExp(
          `/${components.filename}\.${components.format}$`,
        )
        urlObject.pathname = urlObject.pathname.replace(
          regex,
          `.${components.format}`,
        )
      }
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
     * If you just need this function in a browser, you can also use [rokka-render.js](https://github.com/rokka-io/rokka-render.js)
     *
     * @param {string} url                    The url the stack variables are added to
     * @param {object} variables              The variables to add
     * @param {boolean}   [removeSafeUrlFromQuery=false] If true, removes some safe characters from the query
     * @return {string}
     */
    addStackVariables: (
      url,
      variables,
      removeSafeUrlFromQuery = false,
    ): string => {
      return addStackVariables(url, variables, removeSafeUrlFromQuery)
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
