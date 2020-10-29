import { State } from '../index'
import { APISourceimagesMeta } from './sourceimages'
import { RokkaResponse } from '../response'

/**
 * ### Source Images
 *
 * @module sourceimages.meta
 */
export default (state: State): APISourceimagesMeta => {
  return {
    /**
     * ### User metadata
     *
     * See [the user metadata documentation](https://rokka.io/documentation/references/user-metadata.html)
     * for more information.
     */

    /**
     * Add user metadata to a source image.
     *
     * See [the user metadata documentation](https://rokka.io/documentation/references/user-metadata.html)
     * for an explanation.
     *
     * ```js
     * rokka.sourceimages.meta.add('myorg', 'c421f4e8cefe0fd3aab22832f51e85bacda0a47a', {
     *   somefield: 'somevalue',
     *   'int:some_number': 0,
     *   'delete_this': null
     * }).then(function(result) {})
     *   .catch(function(err) {});
     * ```
     *
     * @authenticated
     * @param {string} organization name
     * @param {string} hash         image hash
     * @param {object} data         metadata to add to the image
     * @return {Promise}
     */
    add: (
      organization: string,
      hash: string,
      data: { [key: string]: any }
    ): Promise<RokkaResponse> => {
      return state.request(
        'PATCH',
        `sourceimages/${organization}/${hash}/meta/user`,
        data
      )
    },

    /**
     * Replace user metadata of a source image with the passed data.
     *
     * See [the user metadata documentation](https://rokka.io/documentation/references/user-metadata.html)
     * for an explanation.
     *
     * ```js
     * rokka.sourceimages.meta.replace('myorg', 'c421f4e8cefe0fd3aab22832f51e85bacda0a47a', {
     *   somefield: 'somevalue',
     *   'int:some_number': 0
     * }).then(function(result) {})
     *   .catch(function(err) {});
     * ```
     *
     * @authenticated
     * @param {string} organization name
     * @param {string} hash         image hash
     * @param {object} data         new metadata
     * @return {Promise}
     */
    replace: (
      organization: string,
      hash: string,
      data: { [key: string]: any }
    ): Promise<RokkaResponse> => {
      return state.request(
        'PUT',
        `sourceimages/${organization}/${hash}/meta/user`,
        data
      )
    },

    /**
     * Replace user metadata of a source image with the passed data.
     *
     * See [the user metadata documentation](https://rokka.io/documentation/references/user-metadata.html)
     * for an explanation.
     *
     * ```js
     * rokka.sourceimages.meta.delete('myorg', 'c421f4e8cefe0fd3aab22832f51e85bacda0a47a')
     *   .then(function(result) {})
     *   .catch(function(err) {});
     * ```
     *
     * If the third parameter (field) is specified, it will just delete this field.
     *
     * @authenticated
     * @param {string} organization name
     * @param {string} hash         image hash
     * @param {string} [field=null] optional field to delete
     * @return {Promise}
     */
    delete: (
      organization: string,
      hash: string,
      field: string | null = null
    ): Promise<RokkaResponse> => {
      const fieldpath = field ? `/${field}` : ''
      return state.request(
        'DELETE',
        `sourceimages/${organization}/${hash}/meta/user${fieldpath}`
      )
    }
  }
}
