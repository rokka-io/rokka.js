/**
 * ### Stack options
 *
 * @module stackoptions
 */

import { Response } from '../response'

export interface StackOptions {
  get(): Promise<Response>
}

export default (state): { stackoptions: StackOptions } => {
  const stackoptions: StackOptions = {
    /**
     * Returns a json-schema like definition of options which can be set on a stack.
     *
     * ```js
     * rokka.stackoptions.get()
     *   .then(function(result) {})
     *   .catch(function(err) {});
     * ```
     *
     * @return {Promise}
     */
    get: (): Promise<Response> => {
      return state.request('GET', 'stackoptions', null, null, {
        noAuthHeaders: true
      })
    }
  }
  return {
    stackoptions
  }
}
