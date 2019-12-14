import { isStream } from '../utils'
import { Response } from '../response'
import { State } from '../index'

interface SearchQueryParams {
  [key: string]: any
  limit?: number | null
  offset?: string | number | null
  sort?: string | string[] | null
  search?: { [key: string]: string } | null
  facets?: string | null
  deleted?: boolean | null
}

interface GetQueryParams {
  [key: string]: boolean | undefined
  deleted?: boolean
}

interface CreateMetadata {
  [key: string]: any
  meta_user?: any
  meta_dynamic?: any
}

interface CreateOptions {
  optimize_source?: boolean
}

export interface SourceimagesMeta {
  add: (
    organization: string,
    hash: string,
    data: { [p: string]: any }
  ) => Promise<Response>
  replace: (
    organization: string,
    hash: string,
    data: { [p: string]: any }
  ) => Promise<Response>
  delete: (
    organization: string,
    hash: string,
    field?: string
  ) => Promise<Response>
}

export interface Sourceimages {
  list: (
    organization: string,
    params?: SearchQueryParams | undefined
  ) => Promise<Response>
  get: (
    organization: string,
    hash: string,
    queryParams?: GetQueryParams
  ) => Promise<Response>
  getWithBinaryHash: (
    organization: string,
    binaryHash: string
  ) => Promise<Response>
  download: (organization: string, hash: string) => Promise<Response>
  autolabel: (organization: string, hash: string) => Promise<Response>
  create: (
    organization: string,
    fileName: string,
    binaryData: any,
    metadata?: CreateMetadata | null,
    options?: CreateOptions
  ) => Promise<Response>
  createByUrl: (
    organization: string,
    url: string,
    metadata?: CreateMetadata | null,
    options?: CreateOptions
  ) => Promise<Response>
  delete: (organization: string, hash: string) => Promise<Response>
  deleteWithBinaryHash: (
    organization: string,
    binaryHash: string
  ) => Promise<Response>
  restore: (organization: string, hash: string) => Promise<Response>
  copy: (
    organization: string,
    hash: string,
    destinationOrganization: string,
    overwrite?: boolean
  ) => Promise<Response>
  setSubjectArea: (
    organization: string,
    hash: string,
    coords: { width: number; height: number; x: number; y: number },
    options?: { deletePrevious?: string | boolean }
  ) => Promise<Response>
  removeSubjectArea: (
    organization: string,
    hash: string,
    options?: { deletePrevious?: string | boolean }
  ) => Promise<Response>
  meta: SourceimagesMeta
}

/**
 * ### Source Images
 *
 * @module sourceimages
 */
export default (state: State) => {
  const sourceimages: Sourceimages = {
    /**
     * Get a list of source images.
     *
     * By default, listing sourceimages sorts them by created date descending.
     *
     * ```js
     * rokka.sourceimages.list('myorg')
     *   .then(function(result) {})
     *   .catch(function(err) {});
     * ```
     *
     * Searching for images can be achieved using the `search` parameter.
     * Supported are predefined fields like `height`, `name` etc. but also user metadata.
     * If you search for user metadata, the field name has to be prefixed with `user:TYPE`.
     * All fields are combined with an AND. OR/NOT is not possible.
     *
     * Example:
     *
     * ```js
     * const search = {
     *   'user:int:id': '42',
     *   'height': '64'
     * }
     * rokka.sourceimages.list('myorg', { search: search })
     *   .then(function(result) {})
     *   .catch(function(err) {});
     * ```
     *
     * The search also supports range and wildcard queries.
     * Check out [the rokka documentation](https://rokka.io/documentation/references/searching-images.html) for more.
     *
     * Sorting works with user metadata as well and can be passed as either an array or as a
     * comma separated string.
     *
     * @authenticated
     * @param  {string} organization  name
     * @param  {Object} params Query string params (limit, offset, sort and search)
     * @return {Promise}
     */
    list: (
      organization,
      {
        limit = null,
        offset = null,
        sort = null,
        search = null,
        facets = null,
        deleted = null
      }: SearchQueryParams = {}
    ): Promise<Response> => {
      let queryParams: SearchQueryParams = {}

      if (limit !== null) {
        queryParams.limit = limit
      }
      if (offset !== null) {
        queryParams.offset = offset
      }
      if (facets !== null) {
        queryParams.facets = facets
      }
      if (deleted !== null) {
        queryParams.deleted = deleted
      }

      if (sort !== null) {
        if (Array.isArray(sort)) {
          sort = sort.join(',')
        }
        queryParams.sort = sort
      }
      if (search !== null) {
        queryParams = Object.assign(queryParams, search)
      }

      return state.request(
        'GET',
        `sourceimages/${organization}`,
        null,
        queryParams
      )
    },
    /**
     * Get information of a source image by hash.
     *
     * ```js
     * rokka.sourceimages.get('myorg', 'c421f4e8cefe0fd3aab22832f51e85bacda0a47a')
     *   .then(function(result) {})
     *   .catch(function(err) {});
     * ```
     *
     * @authenticated
     * @param  {string}  organization name
     * @param  {string}  hash         image hash
     * @param  {Object}  queryParams  like {deleted: true}
     * @return {Promise}
     */
    get: (
      organization: string,
      hash: string,
      queryParams: GetQueryParams = {}
    ): Promise<Response> => {
      return state.request(
        'GET',
        `sourceimages/${organization}/${hash}`,
        null,
        queryParams
      )
    },

    /**
     * Get information of a source image by its binary hash.
     *
     * ```js
     * rokka.sourceimages.getWithBinaryHash('myorg', 'b23e17047329b417d3902dc1a5a7e158a3ee822a')
     *   .then(function(result) {})
     *   .catch(function(err) {});
     * ```
     *
     * @authenticated
     * @param  {string}  organization name
     * @param  {string}  binaryHash   binary image hash
     * @return {Promise}
     */
    getWithBinaryHash: (
      organization: string,
      binaryHash: string
    ): Promise<Response> => {
      const queryParams = { binaryHash: binaryHash }

      return state.request(
        'GET',
        `sourceimages/${organization}`,
        null,
        queryParams
      )
    },

    /**
     * Download image by hash.
     *
     * ```js
     * rokka.sourceimages.download('myorg', 'c421f4e8cefe0fd3aab22832f51e85bacda0a47a')
     *   .then(function(result) {})
     *   .catch(function(err) {});
     * ```
     *
     * @authenticated
     * @param  {string}  organization name
     * @param  {string}  hash         image hash
     * @return {Promise}
     */
    download: (organization: string, hash: string): Promise<Response> => {
      return state.request(
        'GET',
        `sourceimages/${organization}/${hash}/download`
      )
    },

    /**
     * Autolabels an image.
     *
     * You need to be a paying customer to be able to use this.
     *
     * ```js
     * rokka.sourceimages.autolabel('myorg', 'c421f4e8cefe0fd3aab22832f51e85bacda0a47a')
     *   .then(function(result) {})
     *   .catch(function(err) {});
     * ```
     *
     * @authenticated
     * @param  {string}  organization name
     * @param  {string}  hash         image hash
     * @return {Promise}
     */
    autolabel: (organization: string, hash: string): Promise<Response> => {
      return state.request(
        'POST',
        `sourceimages/${organization}/${hash}/autolabel`
      )
    },

    /**
     * Upload an image.
     *
     * ```js
     * const file = require('fs').createReadStream('picture.png');
     * rokka.sourceimages.create('myorg', 'picture.png', file)
     *   .then(function(result) {})
     *   .catch(function(err) {});
     * ```
     *
     * With directly adding metadata:
     *
     * ```
     * rokka.sourceimages.create('myorg', 'picture.png', file, {'meta_user': {'foo': 'bar'}})
     * ```
     *
     * @authenticated
     * @param  {string} organization    name
     * @param  {string} fileName        file name
     * @param  {*}      binaryData      either a readable stream (in node.js only) or a binary string
     * @param  {Object} [metadata=null] optional, metadata to be added, either user or dynamic
     * @param  {{optimize_source: boolean}} [options={}] Optional: only {optimize_source: true/false} yet, false is default
     * @return {Promise}
     */
    create: (
      organization: string,
      fileName: string,
      binaryData: any,
      metadata: CreateMetadata | null = null,
      options: CreateOptions = {}
    ): Promise<Response> => {
      const config = {
        multipart: true
      }

      return new Promise(resolve => {
        // Stream and Buffer are only supported by node.js and not browsers natively
        // We just asume that a browser based solution will provide the binaryData
        // of the image as String. But patches are welcome for stream alternatives
        // in browsers
        if (isStream(binaryData)) {
          const chunks: any = []
          binaryData.on('data', (chunk: any) => chunks.push(chunk))
          binaryData.on('end', () => resolve(Buffer.concat(chunks)))
        } else {
          resolve(binaryData)
        }
      }).then(data => {
        const formData: any = {
          ...options
        }
        if (metadata !== null) {
          Object.keys(metadata).forEach(function(o) {
            const data = metadata[o]
            formData[o + '[0]'] =
              typeof data === 'string' ? data : JSON.stringify(data)
          })
        }
        const payload = {
          name: 'filedata',
          formData: formData,
          filename: fileName,
          contents: data
        }
        return state.request(
          'POST',
          `sourceimages/${organization}`,
          payload,
          null,
          config
        )
      })
    },

    /**
     * Upload an image by url.
     *
     * ```js
     * rokka.sourceimages.createByUrl('myorg', 'https://rokka.rokka.io/dynamic/f4d3f334ba90d2b4b00e82953fe0bf93e7ad9912.png')
     *   .then(function(result) {})
     *   .catch(function(err) {});
     * ```
     *
     * With directly adding metadata:
     *
     * ```
     * rokka.sourceimages.createByUrl('myorg',  'https://rokka.rokka.io/dynamic/f4d3f334ba90d2b4b00e82953fe0bf93e7ad9912.png', {'meta_user': {'foo': 'bar'}})
     * ```
     *
     * @authenticated
     * @param  {string} organization     name
     * @param  {string} url              The URL to the remote image
     * @param  {Object} [metadata=null]  optional, metadata to be added, either user or dynamic
     * @param  {{optimize_source: boolean}} [options={}] Optional: only {optimize_source: true/false} yet, false is default
     * @return {Promise}
     */
    createByUrl: (
      organization: string,
      url: string,
      metadata: CreateMetadata | null = null,
      options: CreateOptions = {}
    ): Promise<Response> => {
      const config = {
        form: true
      }

      const formData: any = {
        'url[0]': url,
        ...options
      }
      if (metadata !== null) {
        Object.keys(metadata).forEach(function(o) {
          const data = metadata[o]
          formData[o + '[0]'] =
            typeof data === 'string' ? data : JSON.stringify(data)
        })
      }

      return state.request(
        'POST',
        `sourceimages/${organization}`,
        formData,
        null,
        config
      )
    },

    /**
     * Delete image by hash.
     *
     * ```js
     * rokka.sourceimages.delete('myorg', 'c421f4e8cefe0fd3aab22832f51e85bacda0a47a')
     *   .then(function(result) {})
     *   .catch(function(err) {});
     * ```
     *
     * @authenticated
     * @param  {string}  organization name
     * @param  {string}  hash         image hash
     * @return {Promise}
     */
    delete: (organization: string, hash: string): Promise<Response> => {
      return state.request('DELETE', `sourceimages/${organization}/${hash}`)
    },

    /**
     * Delete source images by its binary hash.
     *
     * ```js
     * rokka.sourceimages.deleteWithBinaryHash('myorg', 'b23e17047329b417d3902dc1a5a7e158a3ee822a')
     *   .then(function(result) {})
     *   .catch(function(err) {});
     * ```
     *
     * @authenticated
     * @param  {string}  organization name
     * @param  {string}  binaryHash   binary image hash
     * @return {Promise}
     */
    deleteWithBinaryHash: (
      organization: string,
      binaryHash: string
    ): Promise<Response> => {
      const queryParams = { binaryHash: binaryHash }

      return state.request(
        'DELETE',
        `sourceimages/${organization}`,
        null,
        queryParams
      )
    },

    /**
     * Restore image by hash.
     *
     * ```js
     * rokka.sourceimages.restore('myorg', 'c421f4e8cefe0fd3aab22832f51e85bacda0a47a')
     *   .then(function(result) {})
     *   .catch(function(err) {});
     * ```
     *
     * @authenticated
     * @param  {string}  organization name
     * @param  {string}  hash         image hash
     * @return {Promise}
     */
    restore: (organization: string, hash: string): Promise<Response> => {
      return state.request(
        'POST',
        `sourceimages/${organization}/${hash}/restore`
      )
    },

    /**
     * Copy image by hash to another org.
     *
     * ```js
     * rokka.sourceimages.copy('myorg', 'c421f4e8cefe0fd3aab22832f51e85bacda0a47a', 'anotherorg', true)
     *   .then(function(result) {})
     *   .catch(function(err) {});
     * ```
     *
     * @authenticated
     * @param  {string}  organization            the org the image is copied from
     * @param  {string}  hash                    image hash
     * @param  {string}  destinationOrganization the org the image is copied to
     * @param  {boolean} [overwrite=true]     if an existing image should be overwritten
     *
     * @return {Promise}
     */
    copy: (
      organization: string,
      hash: string,
      destinationOrganization: string,
      overwrite = true
    ): Promise<Response> => {
      const headers: { Destination: string; Overwrite?: string } = {
        Destination: destinationOrganization
      }
      if (!overwrite) {
        headers.Overwrite = 'F'
      }
      return state.request(
        'COPY',
        `sourceimages/${organization}/${hash}`,
        null,
        null,
        { headers }
      )
    },

    /**
     * ### Dynamic metadata
     *
     * See [the dynamic metadata documentation](https://rokka.io/documentation/references/dynamic-metadata.html) for
     * more information.
     */

    /**
     * Set the subject area of a source image.
     *
     * The [subject area of an image](https://rokka.io/documentation/references/dynamic-metadata.html#subject-area) is
     * used when applying the [crop operation](https://rokka.io/documentation/references/operations.html#crop) with the
     * `auto` anchor to center the cropping box around the subject area.
     *
     * ```js
     * rokka.sourceimages.setSubjectArea('myorg', 'c421f4e8cefe0fd3aab22832f51e85bacda0a47a', {
     *   x: 100,
     *   y: 100,
     *   width: 50,
     *   height: 50
     * },
     * {
     *   deletePrevious: false
     * }).then(function(result) {})
     *   .catch(function(err) {});
     * ```
     *
     * @param {string} organization  name
     * @param {string} hash          image hash
     * @param {{width: number, height: number, x: number, y: number}} coords x, y starting from top left
     * @param {{deletePrevious: boolean}} [options={}] Optional: only {deletePrevious: true/false} yet, false is default
     * @returns {Promise}
     */
    setSubjectArea: (
      organization: string,
      hash: string,
      coords: { width: number; height: number; x: number; y: number },
      options: { deletePrevious?: string | boolean } = {}
    ): Promise<Response> => {
      options.deletePrevious = options.deletePrevious ? 'true' : 'false'

      return state.request(
        'PUT',
        'sourceimages/' +
          organization +
          '/' +
          hash +
          '/meta/dynamic/subject_area',
        coords,
        options
      )
    },

    /**
     * Removes the subject area from a source image.
     *
     * ```js
     * rokka.sourceimages.removeSubjectArea('myorg', 'c421f4e8cefe0fd3aab22832f51e85bacda0a47a')
     *   .then(function(result) {})
     *   .catch(function(err) {});
     * ```
     *
     * @param {string} organization
     * @param {string} hash
     * @param {{deletePrevious: boolean}} [options={}] Optional: only {deletePrevious: true/false} yet, false is default
     * @return {Promise}
     */
    removeSubjectArea: (
      organization: string,
      hash: string,
      options: { deletePrevious?: string | boolean } = {}
    ): Promise<Response> => {
      options.deletePrevious = options.deletePrevious ? 'true' : 'false'

      return state.request(
        'DELETE',
        `sourceimages/${organization}/${hash}/meta/dynamic/subject_area`,
        null,
        options
      )
    },

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
    meta: {
      add: (
        organization: string,
        hash: string,
        data: { [key: string]: any }
      ): Promise<Response> => {
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
      ): Promise<Response> => {
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
      ): Promise<Response> => {
        const fieldpath = field ? `/${field}` : ''
        return state.request(
          'DELETE',
          `sourceimages/${organization}/${hash}/meta/user${fieldpath}`
        )
      }
    }
  }

  return {
    sourceimages
  }
}
