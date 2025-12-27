/**
 * ### Stack options
 *
 * @module stackoptions
 */

import { RokkaResponse } from '../response'
import { State } from '../index'

export class StackOptionsApi {
  constructor(private state: State) {}

  /**
   * Returns a json-schema like definition of options which can be set on a stack.
   *
   * @example
   * ```js
   * const result = await rokka.stackoptions.get()
   * ```
   *
   * @returns Promise resolving to stack options schema
   */
  get(): Promise<RokkaResponse> {
    return this.state.request('GET', 'stackoptions', null, null, {
      noAuthHeaders: true,
    })
  }
}

export type StackOptions = StackOptionsApi

export default (state: State): { stackoptions: StackOptions } => ({
  stackoptions: new StackOptionsApi(state),
})
