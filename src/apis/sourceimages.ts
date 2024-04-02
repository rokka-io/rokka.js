import { isStream } from '../utils'
import {
  RokkaListResponse,
  RokkaListResponseBody,
  RokkaResponse,
} from '../response'
import { State } from '../index'
import SourceImagesMeta from './sourceimages.meta'
import SourceImagesAlias from './sourceimages.alias'
import * as Stream from 'stream'

export interface SearchQueryParams {
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

export interface MetaDataUser {
  [key: string]: string | string[] | boolean | number
}

export interface MetaStatic {
  [key: string]: { [key: string]: any }
}

export interface MetaDataDynamic {
  [key: string]: { [key: string]: any } | undefined
  version?: { text: string }
  subject_area?: { x: number; y: number; width?: number; height?: number }
  crop_area?: { x: number; y: number; width: number; height: number }
}

export interface MetaDataOptions {
  [key: string]: any
  visual_binaryhash?: boolean
  protected?: boolean
}

interface CreateMetadata {
  [key: string]: any
  meta_user?: MetaDataUser
  meta_dynamic?: MetaDataDynamic
  meta_static?: MetaStatic
  options?: MetaDataOptions
}

interface CreateOptions {
  optimize_source?: boolean
}

interface RokkaDownloadResponse extends RokkaResponse {
  body: ReadableStream
}
interface RokkaDownloadAsBufferResponse extends RokkaResponse {
  body: Buffer
}

export interface Sourceimage {
  // we allow any key to keep it somehow compatible with changes in the backend
  // gives less safety when TypeScript checking for wrong properties, but at least autocompletion
  [key: string]:
    | string
    | number
    | boolean
    | undefined
    | MetaDataDynamic
    | MetaDataUser
  hash: string
  short_hash: string
  binary_hash: string
  created: string
  name: string
  mimetype: string
  format: string
  size: number
  width: number
  height: number
  organization: string
  link: string
  static_metadata?: any
  dynamic_metadata?: MetaDataDynamic
  user_metadata?: MetaDataUser
  opaque?: boolean
  deleted?: boolean
  protected?: boolean
}

export interface SourceimagesListResponseBody extends RokkaListResponseBody {
  items: Sourceimage[]
  total: number
  cursor: string
  links: { prev?: { href: string }; next?: { href: string } }
}

export interface SourceimagesListResponse extends RokkaListResponse {
  body: SourceimagesListResponseBody
}

export interface SourceimageResponse extends RokkaResponse {
  body: Sourceimage
}

export interface APISourceimages {
  list: (
    organization: string,
    params?: SearchQueryParams | undefined,
  ) => Promise<SourceimagesListResponse>
  downloadList: (
    organization: string,
    params?: SearchQueryParams | undefined,
  ) => Promise<RokkaDownloadResponse>
  get: (
    organization: string,
    hash: string,
    queryParams?: GetQueryParams,
  ) => Promise<SourceimageResponse>
  getWithBinaryHash: (
    organization: string,
    binaryHash: string,
  ) => Promise<SourceimagesListResponse>
  download: (
    organization: string,
    hash: string,
  ) => Promise<RokkaDownloadResponse>
  downloadAsBuffer: (
    organization: string,
    hash: string,
  ) => Promise<RokkaDownloadAsBufferResponse>
  autolabel: (organization: string, hash: string) => Promise<RokkaResponse>
  autodescription: (
    organization: string,
    hash: string,
    languages: string[],
    force: boolean,
  ) => Promise<RokkaResponse>
  create: (
    organization: string,
    fileName: string,
    binaryData: any,
    metadata?: CreateMetadata | null,
    options?: CreateOptions,
  ) => Promise<SourceimagesListResponse>
  createByUrl: (
    organization: string,
    url: string,
    metadata?: CreateMetadata | null,
    options?: CreateOptions,
  ) => Promise<SourceimagesListResponse>
  delete: (organization: string, hash: string) => Promise<RokkaResponse>
  deleteWithBinaryHash: (
    organization: string,
    binaryHash: string,
  ) => Promise<RokkaResponse>
  restore: (organization: string, hash: string) => Promise<RokkaResponse>
  copy: (
    organization: string,
    hash: string,
    destinationOrganization: string,
    overwrite?: boolean,
  ) => Promise<RokkaResponse>
  setProtected: (
    organization: string,
    hash: string,
    isProtected: boolean,
    options?: { deletePrevious?: string | boolean },
  ) => Promise<RokkaResponse>
  setLocked: (
    organization: string,
    hash: string,
    isLocked: boolean,
  ) => Promise<RokkaResponse>

  setSubjectArea: (
    organization: string,
    hash: string,
    coords: { width: number; height: number; x: number; y: number },
    options?: { deletePrevious?: string | boolean },
  ) => Promise<RokkaResponse>
  removeSubjectArea: (
    organization: string,
    hash: string,
    options?: { deletePrevious?: string | boolean },
  ) => Promise<RokkaResponse>

  addDynamicMetaData: (
    organization: string,
    hash: string,
    name: string,
    data: any,
    options: { deletePrevious?: string | boolean },
  ) => Promise<RokkaResponse>
  deleteDynamicMetaData: (
    organization: string,
    hash: string,
    name: string,
    options: { deletePrevious?: string | boolean },
  ) => Promise<RokkaResponse>

  putName: (
    organization: string,
    hash: string,
    name: string,
  ) => Promise<RokkaListResponse>
  meta: APISourceimagesMeta
  alias: APISourceimagesAlias
}

export interface APISourceimagesMeta {
  add: (
    organization: string,
    hash: string,
    data: { [p: string]: any },
  ) => Promise<RokkaResponse>
  replace: (
    organization: string,
    hash: string,
    data: { [p: string]: any },
  ) => Promise<RokkaResponse>
  delete: (
    organization: string,
    hash: string,
    field?: string,
  ) => Promise<RokkaResponse>
}

export interface APISourceimagesAlias {
  create: (
    organization: string,
    alias: string,
    data: { hash: string },
    params?: { overwrite?: boolean },
  ) => Promise<RokkaResponse>
  delete(organization: string, alias: string): Promise<RokkaResponse>
  get(organization: string, alias: string): Promise<RokkaResponse>
  invalidateCache(organization: string, alias: string): Promise<RokkaResponse>
}

async function stream2buffer(stream: Stream): Promise<Buffer> {
  return new Promise<Buffer>((resolve, reject) => {
    const _buf = Array<any>()

    stream.on('data', chunk => _buf.push(chunk))
    stream.on('end', () => resolve(Buffer.concat(_buf)))
    stream.on('error', err => reject(`error converting stream - ${err}`))
  })
}

function getQueryParamsForList({
  limit = null,
  offset = null,
  sort = null,
  search = null,
  facets = null,
  deleted = null,
}: SearchQueryParams) {
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
  return queryParams
}

/**
 * ### Source Images
 *
 * @module sourceimages
 */
export default (state: State): { sourceimages: APISourceimages } => {
  const sourceimages: APISourceimages = {
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
      params: SearchQueryParams = {},
    ): Promise<SourceimagesListResponse> => {
      const queryParams = getQueryParamsForList(params)

      return state.request(
        'GET',
        `sourceimages/${organization}`,
        null,
        queryParams,
      )
    },
    /**
     * Get a list of source images as zip. Same parameters as the `list` method
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
     * @authenticated
     * @param  {string} organization  name
     * @param  {Object} params Query string params (limit, offset, sort and search)
     * @return {Promise}
     */

    downloadList: (
      organization,
      params: SearchQueryParams = {},
    ): Promise<RokkaDownloadResponse> => {
      const queryParams = getQueryParamsForList(params)

      return state.request(
        'GET',
        `sourceimages/${organization}/download`,
        null,
        queryParams,
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
      queryParams: GetQueryParams = {},
    ): Promise<RokkaResponse> => {
      return state.request(
        'GET',
        `sourceimages/${organization}/${hash}`,
        null,
        queryParams,
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
      binaryHash: string,
    ): Promise<RokkaResponse> => {
      const queryParams = { binaryHash: binaryHash }

      return state.request(
        'GET',
        `sourceimages/${organization}`,
        null,
        queryParams,
      )
    },

    /**
     * Download image by hash, returns a Stream
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
    download: (
      organization: string,
      hash: string,
    ): Promise<RokkaDownloadResponse> => {
      return state.request(
        'GET',
        `sourceimages/${organization}/${hash}/download`,
        undefined,
        undefined,
        { fallBackToText: true },
      )
    },

    /**
     * Download image by hash, returns a Buffer
     *
     * ```js
     * rokka.sourceimages.downloadAsBuffer('myorg', 'c421f4e8cefe0fd3aab22832f51e85bacda0a47a')
     *   .then(function(result) {})
     *   .catch(function(err) {});
     * ```
     *
     * @authenticated
     * @param  {string}  organization name
     * @param  {string}  hash         image hash
     * @return {Promise}
     */
    downloadAsBuffer: async (
      organization: string,
      hash: string,
    ): Promise<RokkaDownloadAsBufferResponse> => {
      return await state
        .request('GET', `sourceimages/${organization}/${hash}/download`)
        .then(async response => {
          return { ...response, body: await stream2buffer(response.body) }
        })
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
    autolabel: (organization: string, hash: string): Promise<RokkaResponse> => {
      return state.request(
        'POST',
        `sourceimages/${organization}/${hash}/autolabel`,
      )
    },

    /**
     * Autodescribes an image. Can be used for alt attributes in img tags.
     *
     * You need to be a paying customer to be able to use this.
     *
     * ```js
     * rokka.sourceimages.autodescription('myorg', 'c421f4e8cefe
     * 0fd3aab22832f51e85bacda0a47a', ['en', 'de'], false)
     *  .then(function(result) {})
     *  .catch(function(err) {});
     *  ```
     *
     * @authenticated
     * @param  {string}   organization name
     * @param  {string}   hash         image hash
     * @param  {string[]} languages    languages to autodescribe the image
     * @param  {boolean}  force If it should be generated, even if already exists
     */
    autodescription: (
      organization: string,
      hash: string,
      languages: string[],
      force = false,
    ): Promise<RokkaResponse> => {
      return state.request(
        'POST',
        `sourceimages/${organization}/${hash}/autodescription`,
        { languages, force },
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
      options: CreateOptions = {},
    ): Promise<RokkaResponse> => {
      const config = {
        multipart: true,
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
          ...options,
        }
        if (metadata !== null) {
          Object.keys(metadata).forEach(function (o) {
            const data = metadata[o]
            formData[o + '[0]'] =
              typeof data === 'string' ? data : JSON.stringify(data)
          })
        }
        const payload = {
          name: 'filedata',
          formData: formData,
          filename: fileName,
          contents: data,
        }
        return state.request(
          'POST',
          `sourceimages/${organization}`,
          payload,
          null,
          config,
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
      options: CreateOptions = {},
    ): Promise<RokkaResponse> => {
      const config = {
        form: true,
      }

      const formData: any = {
        'url[0]': url,
        ...options,
      }
      if (metadata !== null) {
        Object.keys(metadata).forEach(function (o) {
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
        config,
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
    delete: (organization: string, hash: string): Promise<RokkaResponse> => {
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
      binaryHash: string,
    ): Promise<RokkaResponse> => {
      const queryParams = { binaryHash: binaryHash }

      return state.request(
        'DELETE',
        `sourceimages/${organization}`,
        null,
        queryParams,
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
    restore: (organization: string, hash: string): Promise<RokkaResponse> => {
      return state.request(
        'POST',
        `sourceimages/${organization}/${hash}/restore`,
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
      overwrite = true,
    ): Promise<RokkaResponse> => {
      const headers: { Destination: string; Overwrite?: string } = {
        Destination: destinationOrganization,
      }
      if (!overwrite) {
        headers.Overwrite = 'F'
      }
      return state.request(
        'COPY',
        `sourceimages/${organization}/${hash}`,
        null,
        null,
        { headers },
      )
    },

    /**
     * (Un)sets the protected status of an image.
     *
     * Important! Returns a different hash, if the protected status changes
     *
     * ```js
     * rokka.sourceimages.setProtected('myorg', 'c421f4e8cefe0fd3aab22832f51e85bacda0a47a', true,
     * {
     *   deletePrevious: false
     * }).then(function(result) {})
     *   .catch(function(err) {});
     * ```
     *
     * @param {string} organization  name
     * @param {string} hash          image hash
     * @param {boolean} isProtected          If image should be protected or not

     * @param {{deletePrevious: boolean}} [options={}] Optional: only {deletePrevious: true/false} yet, false is default
     * @returns {Promise}
     */
    setProtected: (
      organization: string,
      hash: string,
      isProtected: boolean,
      options: { deletePrevious?: string | boolean } = {},
    ): Promise<RokkaResponse> => {
      options.deletePrevious = options.deletePrevious ? 'true' : 'false'

      return state.request(
        'PUT',
        'sourceimages/' + organization + '/' + hash + '/options/protected',
        isProtected,
        options,
      )
    },
    /**
     * (Un)locks an image.
     *
     * Locks an image, which then can't be deleted.
     *
     * ```js
     * rokka.sourceimages.setLocked('myorg', 'c421f4e8cefe0fd3aab22832f51e85bacda0a47a', true).then(function(result) {})
     *   .catch(function(err) {});
     * ```
     *
     * @param {string} organization  name
     * @param {string} hash          image hash
     * @param {boolean} isLocked          If image should be protected or not

     * @returns {Promise}
     */
    setLocked: (
      organization: string,
      hash: string,
      isLocked: boolean,
    ): Promise<RokkaResponse> => {
      return state.request(
        'PUT',
        'sourceimages/' + organization + '/' + hash + '/options/locked',
        isLocked,
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
      options: { deletePrevious?: string | boolean } = {},
    ): Promise<RokkaResponse> => {
      options.deletePrevious = options.deletePrevious ? 'true' : 'false'

      return state.request(
        'PUT',
        'sourceimages/' +
          organization +
          '/' +
          hash +
          '/meta/dynamic/subject_area',
        coords,
        options,
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
      options: { deletePrevious?: string | boolean } = {},
    ): Promise<RokkaResponse> => {
      options.deletePrevious = options.deletePrevious ? 'true' : 'false'

      return state.request(
        'DELETE',
        `sourceimages/${organization}/${hash}/meta/dynamic/subject_area`,
        null,
        options,
      )
    },
    /**
     * Add/set dynamic metadata to an image
     *
     * See [the dynamic metadata chapter](https://rokka.io/documentation/references/dynamic-metadata.html) for
     * details.
     *
     * ```js
     * rokka.sourceimages.addDynamicMetaData('myorg', 'c421f4e8cefe0fd3aab22832f51e85bacda0a47a', 'crop_area', {
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
     * @param {string} name          the name of the dynamic metarea
     * @param {any} data            The data to be sent. Usually an object
     * @param {{deletePrevious: boolean}} [options={}] Optional: only {deletePrevious: true/false} yet, false is default
     * @returns {Promise}
     */
    addDynamicMetaData: (
      organization: string,
      hash: string,
      name: string,
      data: any,
      options: { deletePrevious?: string | boolean } = {},
    ): Promise<RokkaResponse> => {
      options.deletePrevious = options.deletePrevious ? 'true' : 'false'

      return state.request(
        'PUT',
        'sourceimages/' + organization + '/' + hash + '/meta/dynamic/' + name,
        data,
        options,
      )
    },

    /**
     * Delete dynamic metadata of an image
     *
     * See [the dynamic metadata chapter](https://rokka.io/documentation/references/dynamic-metadata.html) for
     * details.
     *
     * ```js
     * rokka.sourceimages.addDynamicMetaData('myorg', 'c421f4e8cefe0fd3aab22832f51e85bacda0a47a', 'crop_area',
     * {
     *   deletePrevious: false
     * }).then(function(result) {})
     *   .catch(function(err) {});
     * ```
     *
     * @param {string} organization  name
     * @param {string} hash          image hash
     * @param {string} name          the name of the dynamic metarea
     * @param {{deletePrevious: boolean}} [options={}] Optional: only {deletePrevious: true/false} yet, false is default
     * @returns {Promise}
     */
    deleteDynamicMetaData: (
      organization: string,
      hash: string,
      name: string,
      options: { deletePrevious?: string | boolean } = {},
    ): Promise<RokkaResponse> => {
      options.deletePrevious = options.deletePrevious ? 'true' : 'false'

      return state.request(
        'DELETE',
        'sourceimages/' + organization + '/' + hash + '/meta/dynamic/' + name,
        options,
      )
    },

    /**
     * Change the name of a  source image.
     *
     * ```js
     * rokka.sourceimages.putName('myorg', 'c421f4e8cefe0fd3aab22832f51e85bacda0a47a', name).then(function(result) {})
     *   .catch(function(err) {});
     * ```
     *
     * @authenticated
     * @param {string} organization name
     * @param {string} hash         image hash
     * @param {string} name         new name of the image
     * @return {Promise}
     */
    putName: (
      organization: string,
      hash: string,
      name: string,
    ): Promise<RokkaResponse> => {
      return state.request(
        'PUT',
        `sourceimages/${organization}/${hash}/name`,
        JSON.stringify(name),
      )
    },
    meta: SourceImagesMeta(state),
    alias: SourceImagesAlias(state),
  }

  return {
    sourceimages,
  }
}
