/**
 * ### Stack options
 *
 * @module stackoptions
 */

import { RokkaResponse } from '../response'
import { State } from '../index'

export interface StackOptions {
  get(): Promise<RokkaResponse>
}

export default (state: State): { stackoptions: StackOptions } => {
  const stackoptions: StackOptions = {
    /**
     * Returns a json-schema like definition of options which can be set on a stack.
     *
     * @example
     * ```js
     * rokka.stackoptions.get()
     *   .then(function(result) {})
     *   .catch(function(err) {});
     * ```
     *
     * @returns Promise resolving to stack options schema
     */
    get: (): Promise<RokkaResponse> => {
      return state.request('GET', 'stackoptions', null, null, {
        noAuthHeaders: true,
      })
    },
  }
  return {
    stackoptions,
  }
}
