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
export class RenderApi {
  constructor(private state: State) {}

  /**
   * Get URL for rendering an image.
   *
   * If you just need this function in a browser, you can also use [rokka-render.js](https://github.com/rokka-io/rokka-render.js)
   *
   * @example
   * ```js
   * rokka.render.getUrl('myorg', 'c421f4e8cefe0fd3aab22832f51e85bacda0a47a', 'png', 'mystack')
   * ```
   *
   * @param organization - Organization name
   * @param hash - Image hash
   * @param format - Image format: `jpg`, `png` or `gif`
   * @param stack - Optional stack name or an array of stack operation objects
   * @param options - Optional. filename: Adds the filename to the URL, stackoptions: Adds stackoptions to the URL
   * @returns The render URL
   */
  getUrl(
    organization: string,
    hash: string,
    format: string,
    stack: string | object,
    options?: GetUrlOptions,
  ): string {
    return getUrl(
      organization,
      hash,
      format,
      stack,
      options,
      this.state.renderHost,
    )
  }

  /**
   * Get URL for rendering an image from a rokka render URL.
   *
   * If you just need this function in a browser, you can also use [rokka-render.js](https://github.com/rokka-io/rokka-render.js)
   *
   * @example
   * ```js
   * rokka.render.getUrlFromUrl('https://myorg.rokka.io/dynamic/c421f4e8cefe0fd3aab22832f51e85bacda0a47a.png', 'mystack')
   * ```
   *
   * @param rokkaUrl - Rokka render URL
   * @param stack - Stack name or an array of stack operation objects
   * @param options - Optional. filename: Adds or changes the filename to the URL, stackoptions: Adds stackoptions to the URL, format: Changes the format
   * @returns The render URL
   */
  getUrlFromUrl(
    rokkaUrl: string,
    stack: string | object,
    options: GetUrlFromUrlOptions = {},
  ): string {
    return getUrlFromUrl(rokkaUrl, stack, options, this.state.renderHost)
  }

  /**
   * Get image hashes and some other info belonging to a album (from metadata: user:array:albums)
   *
   * @example
   * ```js
   * rokka.render.imagesByAlbum('myorg', 'Albumname', { favorites })
   * ```
   *
   * @param organization - Organization name
   * @param album - Album name
   * @param options - Optional options
   * @returns Promise resolving to album images
   */
  imagesByAlbum(
    organization: string,
    album: string,
    options?: ImagesByAlbumOptions,
  ): Promise<RokkaResponse> {
    const host = this.state.renderHost.replace('{organization}', organization)

    let filename = 'all'
    if (options?.favorites) {
      filename = 'favorites'
    }
    return this.state.request(
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
  }

  /**
   * Signs a Rokka URL with an option valid until date.
   *
   * It also rounds up the date to the next 5 minutes (300 seconds) to
   * improve CDN caching, can be changed
   *
   * @param url - The URL to be signed
   * @param signKey - The organization's sign key
   * @param options - Optional options. until: Valid until date, roundDateUpTo: For improved caching, the date can be rounded up by so many seconds (default: 300)
   * @returns The signed URL
   */
  signUrl: SignUrlType = (
    url,
    signKey,
    { until = null, roundDateUpTo = 300 } = {},
  ) => {
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
    return this.signUrlWithOptions(url, signKey, options)
  }

  /**
   * Signs a rokka URL with a sign key and optional signature options.
   *
   * @param url - The URL to be signed
   * @param signKey - The organization's sign key
   * @param options - Optional signature options
   * @returns The signed URL
   */
  signUrlWithOptions: SignUrlWithOptionsType = (url, signKey, options) => {
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
      const regex = new RegExp(`/${components.filename}\.${components.format}$`)
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
  }

  /**
   * Adds stack variables to a rokka URL in a safe way
   *
   * Uses the v query parameter, if a variable shouldn't be in the path
   *
   * If you just need this function in a browser, you can also use [rokka-render.js](https://github.com/rokka-io/rokka-render.js)
   *
   * @param url - The URL the stack variables are added to
   * @param variables - The variables to add
   * @param removeSafeUrlFromQuery - If true, removes some safe characters from the query
   * @returns The URL with variables added
   */
  addStackVariables: AddStackVariablesType = (
    url,
    variables,
    removeSafeUrlFromQuery = false,
  ): string => {
    return addStackVariables(url, variables, removeSafeUrlFromQuery)
  }

  /**
   * Get rokka components from an URL object.
   *
   * Returns false, if it could not parse it as rokka URL.
   *
   * @param urlObject - The URL object to parse
   * @returns URL components or false if not a rokka URL
   */
  getUrlComponents: GetUrlComponentsType = getUrlComponents
}

export type Render = RenderApi

export default (state: State): { render: Render } => ({
  render: new RenderApi(state),
})
