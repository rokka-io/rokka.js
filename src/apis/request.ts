/**
 * ### request
 *
 * @module request
 */

import { RokkaResponse } from '../response'
import { State } from '../index'

export interface Request {
  (path: string, method?: string, body?: any | null): Promise<RokkaResponse>
}
export default (state: State): { request: Request } => {
  /**
   * Does an authenticated request for any path to the Rokka API
   * @param path    {string}    The path (without leading slash)
   * @param method  {string}    HTTP method, Default GET
   * @param body    {any|null}  The body payload. Default: null
   */
  const request = (path: string, method = 'GET', body: any | null = null) => {
    return state.request(method, path, body)
  }
  return {
    request,
  }
}
