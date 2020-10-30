import { stringifyOperations } from '../utils'
import { State } from '../index'
const sha256 = require('js-sha256')
//const btoa = require('btoa')
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

export interface Render {
  getUrl(
    organization: string,
    hash: string,
    format: string,
    mixed: string | object
  ): string

  signUrl: SignUrlType
  signUrlWithOptions: SignUrlWithOptionsType
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
        urlObject.searchParams.append('sigopts', sigOptsBase64)
      } else {
        urlObject.searchParams.delete('sigopts')
      }

      // remove sig
      urlObject.searchParams.delete('sig')

      const urlPath = urlObject.pathname + urlObject.search
      const sigString = urlPath + ':' + signKey
      const hash = sha256(sigString)

      // append new sig
      urlObject.searchParams.append('sig', hash.substring(0, 16))
      return urlObject.toString()
    }
  }

  return {
    render
  }
}
