/**
 * ### Stacks
 *
 * @module stacks
 */

import { RokkaResponse } from '../response'
import { Expression } from './expressions'
import { State } from '../index'
import { StackOperation, StackOptions, Variables } from 'rokka-render'
export { StackOperation, StackOptions, Variables } from 'rokka-render'

export interface Stacks {
  delete(organization: string, name: string): Promise<RokkaResponse>
  get(organization: string, name: string): Promise<RokkaResponse>
  create(
    organization: string,
    name: string,
    stackConfig: StackConfig | StackOperation[],
    params?: { overwrite?: boolean } | StackOptions,
    ...rest: boolean[]
  ): Promise<RokkaResponse>

  list(
    organization: string,
    limit?: number | null,
    offset?: string | null,
  ): Promise<RokkaResponse>

  invalidateCache(organization: string, name: string): Promise<RokkaResponse>
}

export interface StackConfig {
  operations?: StackOperation[]
  options?: StackOptions
  expressions?: Expression[]
  variables?: Variables
}

export default (state: State): { stacks: Stacks } => {
  const stacks = {
    /**
     * Get a list of available stacks.
     *
     * @remarks
     * Requires authentication.
     *
     * @example
     * ```js
     * const result = await rokka.stacks.list('myorg')
     * ```
     *
     * @param organization - Organization name
     * @param limit - Maximum number of stacks to return
     * @param offset - Cursor for pagination
     * @returns Promise resolving to the list of stacks
     */
    list: (
      organization: string,
      limit: number | null = null,
      offset: string | null = null,
    ): Promise<RokkaResponse> => {
      const queryParams: { limit?: number; offset?: string } = {}

      if (limit !== null) {
        queryParams.limit = limit
      }
      if (offset !== null) {
        queryParams.offset = offset
      }

      return state.request('GET', `stacks/${organization}`, null, queryParams)
    },

    /**
     * Get details about a stack.
     *
     * @remarks
     * Requires authentication.
     *
     * @example
     * ```js
     * const result = await rokka.stacks.get('myorg', 'mystack')
     * ```
     *
     * @param organization - Organization name
     * @param name - Stack name
     * @returns Promise resolving to stack details
     */

    get: (organization: string, name: string): Promise<RokkaResponse> => {
      return state.request('GET', `stacks/${organization}/${name}`)
    },

    /**
     * Create a new stack.
     *
     * The signature of this method changed in 0.27.
     *
     * Using a single stack operation object (without an enclosing array) as the 3rd parameter (stackConfig) is
     * since version 0.27.0 not supported anymore.
     *
     * @remarks
     * Requires authentication.
     *
     * @example
     * ```js
     * const operations = [
     *   rokka.operations.rotate(45),
     *   rokka.operations.resize(100, 100)
     * ]
     *
     * // stack options are optional
     * const options = {
     *   'jpg.quality': 80,
     *   'webp.quality': 80
     * }
     *
     * // stack expressions are optional
     * const expressions = [
     *   rokka.expressions.default('options.dpr > 2', { 'jpg.quality': 60, 'webp.quality': 60 })
     * ]
     *
     * // query params are optional
     * const queryParams = { overwrite: true }
     * const result = await rokka.stacks.create(
     *   'test',
     *   'mystack',
     *   { operations, options, expressions },
     *   queryParams
     * )
     * ```
     *
     * @param organization - Organization name
     * @param name - Stack name
     * @param stackConfig - Object with the stack config of stack operations, options and expressions
     * @param params - Query params, only overwrite is currently supported
     * @returns Promise resolving to the created stack
     */

    create: (
      organization: string,
      name: string,
      stackConfig: StackConfig | StackOperation[],
      params: { overwrite?: boolean } | StackOptions = {},
      ...rest: boolean[]
    ): Promise<RokkaResponse> => {
      let queryParams = Object.assign({}, params)
      let body: StackConfig = {}

      // backwards compatibility for previous signature:
      // create(organization, name, operations, options = null, overwrite = false)
      if (Array.isArray(stackConfig)) {
        body.operations = stackConfig
        body.options = params as StackOptions
        const _overwrite = rest.length > 0 ? rest[0] : false
        queryParams = {}
        if (_overwrite) {
          queryParams.overwrite = _overwrite
        }
      } else {
        body = stackConfig
      }

      return state.request(
        'PUT',
        `stacks/${organization}/${name}`,
        body,
        queryParams,
      )
    },

    /**
     * Delete a stack.
     *
     * @remarks
     * Requires authentication.
     *
     * @example
     * ```js
     * await rokka.stacks.delete('myorg', 'mystack')
     * ```
     *
     * @param organization - Organization name
     * @param name - Stack name
     * @returns Promise resolving when stack is deleted
     */
    delete: (organization: string, name: string): Promise<RokkaResponse> => {
      return state.request('DELETE', `stacks/${organization}/${name}`)
    },

    /**
     * Invalidate the CDN cache for a stack.
     *
     * See [the caching documentation](https://rokka.io/documentation/references/caching.html)
     * for more information.
     *
     * @remarks
     * Requires authentication.
     *
     * @example
     * ```js
     * await rokka.stacks.invalidateCache('myorg', 'mystack')
     * ```
     *
     * @param organization - Organization name
     * @param name - Stack name
     * @returns Promise resolving when cache is invalidated
     */
    invalidateCache: (
      organization: string,
      name: string,
    ): Promise<RokkaResponse> => {
      return state.request('DELETE', `stacks/${organization}/${name}/cache`)
    },
  }

  return {
    stacks,
  }
}
