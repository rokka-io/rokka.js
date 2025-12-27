/**
 * ### Utils
 *
 * @module utils
 */
import { RokkaResponse } from '../response'
import { State } from '../index'

export interface SignUrlOptions {
  /** Round the expiration date up to this many seconds (for better caching) */
  roundDateUpTo?: number
}

export interface Utils {
  signUrl(
    organization: string,
    url: string,
    options?: SignUrlOptions,
  ): Promise<RokkaResponse>
}

export default (state: State): { utils: Utils } => {
  const utils: Utils = {
    /**
     * Sign a URL using the server-side signing endpoint.
     *
     * This is useful when you don't have access to the signing key on the client side
     * but want to generate signed URLs.
     *
     * See [the signing URLs documentation](https://rokka.io/documentation/references/signing-urls.html)
     * for more information.
     *
     * @remarks
     * Requires authentication.
     *
     * @example
     * ```js
     * const result = await rokka.utils.signUrl('myorg', 'https://myorg.rokka.io/dynamic/abc123.jpg')
     * console.log(result.body.signed_url)
     * ```
     *
     * @param organization - Organization name
     * @param url - The URL to sign
     * @param options - Optional signing options
     * @returns Promise resolving to the signed URL response
     */
    signUrl: (
      organization: string,
      url: string,
      options: SignUrlOptions = {},
    ): Promise<RokkaResponse> => {
      const body: { url: string; round_date_up_to?: number } = { url }
      if (options.roundDateUpTo !== undefined) {
        body.round_date_up_to = options.roundDateUpTo
      }
      return state.request('POST', `utils/${organization}/sign_url`, body)
    },
  }

  return {
    utils,
  }
}
