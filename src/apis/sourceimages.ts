import { isStream } from '../utils'
import {
  RokkaListResponse,
  RokkaListResponseBody,
  RokkaResponse,
} from '../response'
import { State } from '../index'
import SourceImagesMeta, { SourceimagesMetaApi } from './sourceimages.meta'
import SourceImagesAlias, { SourceimagesAliasApi } from './sourceimages.alias'
import * as Stream from 'stream'

export { APISourceimagesMeta } from './sourceimages.meta'
export { APISourceimagesAlias } from './sourceimages.alias'

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
  if (limit !== null) queryParams.limit = limit
  if (offset !== null) queryParams.offset = offset
  if (facets !== null) queryParams.facets = facets
  if (deleted !== null) queryParams.deleted = deleted
  if (sort !== null) {
    if (Array.isArray(sort)) sort = sort.join(',')
    queryParams.sort = sort
  }
  if (search !== null) queryParams = Object.assign(queryParams, search)
  return queryParams
}

/**
 * ### Source Images
 *
 * @module sourceimages
 */
export class SourceimagesApi {
  readonly meta: SourceimagesMetaApi
  readonly alias: SourceimagesAliasApi

  constructor(private state: State) {
    this.meta = SourceImagesMeta(state)
    this.alias = SourceImagesAlias(state)
  }

  /**
   * Get a list of source images.
   *
   * By default, listing sourceimages sorts them by created date descending.
   *
   * Searching for images can be achieved using the `search` parameter.
   * Supported are predefined fields like `height`, `name` etc. but also user metadata.
   * If you search for user metadata, the field name has to be prefixed with `user:TYPE`.
   * All fields are combined with an AND. OR/NOT is not possible.
   *
   * The search also supports range and wildcard queries.
   * Check out [the rokka documentation](https://rokka.io/documentation/references/searching-images.html) for more.
   *
   * Sorting works with user metadata as well and can be passed as either an array or as a
   * comma separated string.
   *
   * @remarks
   * Requires authentication.
   *
   * @example
   * ```js
   * const result = await rokka.sourceimages.list('myorg')
   * ```
   *
   * @example Searching for images
   * ```js
   * const search = {
   *   'user:int:id': '42',
   *   'height': '64'
   * }
   * const result = await rokka.sourceimages.list('myorg', { search: search })
   * ```
   *
   * @param organization - Organization name
   * @param params - Query string params (limit, offset, sort and search)
   * @returns Promise resolving to the list of source images
   */
  list(
    organization: string,
    params: SearchQueryParams = {},
  ): Promise<SourceimagesListResponse> {
    const queryParams = getQueryParamsForList(params)
    return this.state.request(
      'GET',
      `sourceimages/${organization}`,
      null,
      queryParams,
    )
  }

  /**
   * Get a list of source images as zip. Same parameters as the `list` method
   *
   * @example
   * ```js
   * const search = {
   *   'user:int:id': '42',
   *   'height': '64'
   * }
   * const result = await rokka.sourceimages.downloadList('myorg', { search: search })
   * ```
   *
   * @param organization - Organization name
   * @param params - Query string params (limit, offset, sort and search)
   * @returns Promise resolving to a download stream
   */
  downloadList(
    organization: string,
    params: SearchQueryParams = {},
  ): Promise<RokkaDownloadResponse> {
    const queryParams = getQueryParamsForList(params)
    return this.state.request(
      'GET',
      `sourceimages/${organization}/download`,
      null,
      queryParams,
    )
  }

  /**
   * Get information of a source image by hash.
   *
   * ```js
   * const result = await rokka.sourceimages.get('myorg', 'c421f4e8cefe0fd3aab22832f51e85bacda0a47a')
   * ```
   *
   * @param organization - Organization name
   * @param hash - Image hash
   * @param queryParams - Query params like {deleted: true}
   * @returns Promise resolving to the source image
   */
  get(
    organization: string,
    hash: string,
    queryParams: GetQueryParams = {},
  ): Promise<RokkaResponse> {
    return this.state.request(
      'GET',
      `sourceimages/${organization}/${hash}`,
      null,
      queryParams,
    )
  }

  /**
   * Get information of a source image by its binary hash.
   *
   * ```js
   * const result = await rokka.sourceimages.getWithBinaryHash('myorg', 'b23e17047329b417d3902dc1a5a7e158a3ee822a')
   * ```
   *
   * @param organization - Organization name
   * @param binaryHash - Binary image hash
   * @returns Promise resolving to the source image
   */
  getWithBinaryHash(
    organization: string,
    binaryHash: string,
  ): Promise<RokkaResponse> {
    return this.state.request('GET', `sourceimages/${organization}`, null, {
      binaryHash,
    })
  }

  /**
   * Download image by hash, returns a Stream
   *
   * ```js
   * const result = await rokka.sourceimages.download('myorg', 'c421f4e8cefe0fd3aab22832f51e85bacda0a47a')
   * ```
   *
   * @param organization - Organization name
   * @param hash - Image hash
   * @returns Promise resolving to a download stream
   */
  download(organization: string, hash: string): Promise<RokkaDownloadResponse> {
    return this.state.request(
      'GET',
      `sourceimages/${organization}/${hash}/download`,
      undefined,
      undefined,
      { fallBackToText: true },
    )
  }

  /**
   * Download image by hash, returns a Buffer
   *
   * ```js
   * const result = await rokka.sourceimages.downloadAsBuffer('myorg', 'c421f4e8cefe0fd3aab22832f51e85bacda0a47a')
   * ```
   *
   * @param organization - Organization name
   * @param hash - Image hash
   * @returns Promise resolving to a buffer
   */
  async downloadAsBuffer(
    organization: string,
    hash: string,
  ): Promise<RokkaDownloadAsBufferResponse> {
    return await this.state
      .request('GET', `sourceimages/${organization}/${hash}/download`)
      .then(async response => {
        return { ...response, body: await stream2buffer(response.body) }
      })
  }

  /**
   * Autolabels an image.
   *
   * You need to be a paying customer to be able to use this.
   *
   * ```js
   * const result = await rokka.sourceimages.autolabel('myorg', 'c421f4e8cefe0fd3aab22832f51e85bacda0a47a')
   * ```
   *
   * @param organization - Organization name
   * @param hash - Image hash
   * @returns Promise resolving to the autolabel result
   */
  autolabel(organization: string, hash: string): Promise<RokkaResponse> {
    return this.state.request(
      'POST',
      `sourceimages/${organization}/${hash}/autolabel`,
    )
  }

  /**
   * Autodescribes an image. Can be used for alt attributes in img tags.
   *
   * You need to be a paying customer to be able to use this.
   *
   * ```js
   * const result = await rokka.sourceimages.autodescription('myorg', 'c421f4e8cefe0fd3aab22832f51e85bacda0a47a', ['en', 'de'], false)
   * ```
   *
   * @param organization - Organization name
   * @param hash - Image hash
   * @param languages - Languages to autodescribe the image
   * @param force - If it should be generated, even if already exists
   * @returns Promise resolving to the autodescription result
   */
  autodescription(
    organization: string,
    hash: string,
    languages: string[],
    force = false,
  ): Promise<RokkaResponse> {
    return this.state.request(
      'POST',
      `sourceimages/${organization}/${hash}/autodescription`,
      { languages, force },
    )
  }

  /**
   * Upload an image.
   *
   * ```js
   * const file = require('fs').createReadStream('picture.png')
   * const result = await rokka.sourceimages.create('myorg', 'picture.png', file)
   * ```
   *
   * With directly adding metadata:
   *
   * ```js
   * rokka.sourceimages.create('myorg', 'picture.png', file, {'meta_user': {'foo': 'bar'}})
   * ```
   *
   * @param organization - Organization name
   * @param fileName - File name
   * @param binaryData - Either a readable stream (in node.js only) or a binary string
   * @param metadata - Optional metadata to be added, either user or dynamic
   * @param options - Optional: only {optimize_source: true/false} yet, false is default
   * @returns Promise resolving to the created source image
   */
  create(
    organization: string,
    fileName: string,
    binaryData: any,
    metadata: CreateMetadata | null = null,
    options: CreateOptions = {},
  ): Promise<RokkaResponse> {
    const config = { multipart: true }
    return new Promise(resolve => {
      if (isStream(binaryData)) {
        const chunks: any = []
        binaryData.on('data', (chunk: any) => chunks.push(chunk))
        binaryData.on('end', () => resolve(Buffer.concat(chunks)))
      } else {
        resolve(binaryData)
      }
    }).then(data => {
      const formData: any = { ...options }
      if (metadata !== null) {
        Object.keys(metadata).forEach(function (o) {
          const d = metadata[o]
          formData[o + '[0]'] = typeof d === 'string' ? d : JSON.stringify(d)
        })
      }
      const payload = {
        name: 'filedata',
        formData,
        filename: fileName,
        contents: data,
      }
      return this.state.request(
        'POST',
        `sourceimages/${organization}`,
        payload,
        null,
        config,
      )
    })
  }

  /**
   * Upload an image by url.
   *
   * ```js
   * const result = await rokka.sourceimages.createByUrl('myorg', 'https://rokka.rokka.io/dynamic/f4d3f334ba90d2b4b00e82953fe0bf93e7ad9912.png')
   * ```
   *
   * With directly adding metadata:
   *
   * ```js
   * rokka.sourceimages.createByUrl('myorg', 'https://rokka.rokka.io/dynamic/f4d3f334ba90d2b4b00e82953fe0bf93e7ad9912.png', {'meta_user': {'foo': 'bar'}})
   * ```
   *
   * @param organization - Organization name
   * @param url - The URL to the remote image
   * @param metadata - Optional metadata to be added, either user or dynamic
   * @param options - Optional: only {optimize_source: true/false} yet, false is default
   * @returns Promise resolving to the created source image
   */
  createByUrl(
    organization: string,
    url: string,
    metadata: CreateMetadata | null = null,
    options: CreateOptions = {},
  ): Promise<RokkaResponse> {
    const config = { form: true }
    const formData: any = { 'url[0]': url, ...options }
    if (metadata !== null) {
      Object.keys(metadata).forEach(function (o) {
        const d = metadata[o]
        formData[o + '[0]'] = typeof d === 'string' ? d : JSON.stringify(d)
      })
    }
    return this.state.request(
      'POST',
      `sourceimages/${organization}`,
      formData,
      null,
      config,
    )
  }

  /**
   * Delete image by hash.
   *
   * ```js
   * await rokka.sourceimages.delete('myorg', 'c421f4e8cefe0fd3aab22832f51e85bacda0a47a')
   * ```
   *
   * @param organization - Organization name
   * @param hash - Image hash
   * @returns Promise resolving when the image is deleted
   */
  delete(organization: string, hash: string): Promise<RokkaResponse> {
    return this.state.request('DELETE', `sourceimages/${organization}/${hash}`)
  }

  /**
   * Delete source images by its binary hash.
   *
   * ```js
   * await rokka.sourceimages.deleteWithBinaryHash('myorg', 'b23e17047329b417d3902dc1a5a7e158a3ee822a')
   * ```
   *
   * @param organization - Organization name
   * @param binaryHash - Binary image hash
   * @returns Promise resolving when the images are deleted
   */
  deleteWithBinaryHash(
    organization: string,
    binaryHash: string,
  ): Promise<RokkaResponse> {
    return this.state.request('DELETE', `sourceimages/${organization}`, null, {
      binaryHash,
    })
  }

  /**
   * Restore image by hash.
   *
   * ```js
   * await rokka.sourceimages.restore('myorg', 'c421f4e8cefe0fd3aab22832f51e85bacda0a47a')
   * ```
   *
   * @param organization - Organization name
   * @param hash - Image hash
   * @returns Promise resolving when the image is restored
   */
  restore(organization: string, hash: string): Promise<RokkaResponse> {
    return this.state.request(
      'POST',
      `sourceimages/${organization}/${hash}/restore`,
    )
  }

  /**
   * Copy image by hash to another organization.
   *
   * ```js
   * await rokka.sourceimages.copy('myorg', 'c421f4e8cefe0fd3aab22832f51e85bacda0a47a', 'anotherorg', true)
   * ```
   *
   * @param organization - Organization name
   * @param hash - Image hash
   * @param destinationOrganization - Destination organization
   * @param overwrite - Whether to overwrite if the image already exists
   * @returns Promise resolving when the image is copied
   */
  copy(
    organization: string,
    hash: string,
    destinationOrganization: string,
    overwrite = true,
  ): Promise<RokkaResponse> {
    const headers: { Destination: string; Overwrite?: string } = {
      Destination: destinationOrganization,
    }
    if (!overwrite) headers.Overwrite = 'F'
    return this.state.request(
      'COPY',
      `sourceimages/${organization}/${hash}`,
      null,
      null,
      { headers },
    )
  }

  /**
   * Copy multiple images to another organization.
   *
   * ```js
   * await rokka.sourceimages.copyAll('myorg', ['hash1', 'hash2'], 'anotherorg', true)
   * ```
   *
   * @param organization - Organization name
   * @param hashes - Array of image hashes
   * @param destinationOrganization - Destination organization
   * @param overwrite - Whether to overwrite if images already exist
   * @returns Promise resolving when the images are copied
   */
  copyAll(
    organization: string,
    hashes: string[],
    destinationOrganization: string,
    overwrite = true,
  ): Promise<RokkaResponse> {
    const headers: { Destination: string; Overwrite?: string } = {
      Destination: destinationOrganization,
    }
    if (!overwrite) headers.Overwrite = 'F'
    return this.state.request(
      'POST',
      `sourceimages/${organization}/copy`,
      hashes,
      null,
      { headers },
    )
  }

  /**
   * Invalidate the CDN cache for a source image.
   *
   * See [the caching documentation](https://rokka.io/documentation/references/caching.html) for more information.
   *
   * ```js
   * await rokka.sourceimages.invalidateCache('myorg', 'c421f4e8cefe0fd3aab22832f51e85bacda0a47a')
   * ```
   *
   * @param organization - Organization name
   * @param hash - Image hash
   * @returns Promise resolving when the cache is invalidated
   */
  invalidateCache(organization: string, hash: string): Promise<RokkaResponse> {
    return this.state.request(
      'DELETE',
      `sourceimages/${organization}/${hash}/cache`,
    )
  }

  /**
   * Set the protected status of a source image.
   *
   * Important! Returns a different hash, if the protected status changes
   * ```js
   * const result = await rokka.sourceimages.setProtected('myorg', 'c421f4e8cefe0fd3aab22832f51e85bacda0a47a', true, {
   *   deletePrevious: false
   * })
   * ```
   *
   * @param organization - Organization name
   * @param hash - Image hash
   * @param isProtected - If image should be protected or not
   * @param options - Optional: only {deletePrevious: true/false} yet, false is default
   * @returns Promise resolving to the updated source image
   */
  setProtected(
    organization: string,
    hash: string,
    isProtected: boolean,
    options: { deletePrevious?: string | boolean } = {},
  ): Promise<RokkaResponse> {
    options.deletePrevious = options.deletePrevious ? 'true' : 'false'
    return this.state.request(
      'PUT',
      `sourceimages/${organization}/${hash}/options/protected`,
      isProtected,
      options,
    )
  }

  /**
   * Set the locked status of a source image. Locked images cannot be deleted.
   *
   * ```js
   * const result = await rokka.sourceimages.setLocked('myorg', 'c421f4e8cefe0fd3aab22832f51e85bacda0a47a', true)
   * ```
   *
   * @param organization - Organization name
   * @param hash - Image hash
   * @param isLocked - If image should be locked or not
   * @returns Promise resolving to the updated source image
   */
  setLocked(
    organization: string,
    hash: string,
    isLocked: boolean,
  ): Promise<RokkaResponse> {
    return this.state.request(
      'PUT',
      `sourceimages/${organization}/${hash}/options/locked`,
      isLocked,
    )
  }

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
   * const result = await rokka.sourceimages.setSubjectArea('myorg', 'c421f4e8cefe0fd3aab22832f51e85bacda0a47a', {
   *   x: 100,
   *   y: 100,
   *   width: 50,
   *   height: 50
   * }, {
   *   deletePrevious: false
   * })
   * ```
   *
   * @param organization - Organization name
   * @param hash - Image hash
   * @param coords - x, y starting from top left
   * @param options - Optional: only {deletePrevious: true/false} yet, false is default
   * @returns Promise resolving to the updated source image
   */
  setSubjectArea(
    organization: string,
    hash: string,
    coords: { width: number; height: number; x: number; y: number },
    options: { deletePrevious?: string | boolean } = {},
  ): Promise<RokkaResponse> {
    options.deletePrevious = options.deletePrevious ? 'true' : 'false'
    return this.state.request(
      'PUT',
      `sourceimages/${organization}/${hash}/meta/dynamic/subject_area`,
      coords,
      options,
    )
  }

  /**
   * Removes the subject area from a source image.
   *
   * ```js
   * await rokka.sourceimages.removeSubjectArea('myorg', 'c421f4e8cefe0fd3aab22832f51e85bacda0a47a')
   * ```
   *
   * @param organization - Organization name
   * @param hash - Image hash
   * @param options - Optional: only {deletePrevious: true/false} yet, false is default
   * @returns Promise resolving when the subject area is removed
   */
  removeSubjectArea(
    organization: string,
    hash: string,
    options: { deletePrevious?: string | boolean } = {},
  ): Promise<RokkaResponse> {
    options.deletePrevious = options.deletePrevious ? 'true' : 'false'
    return this.state.request(
      'DELETE',
      `sourceimages/${organization}/${hash}/meta/dynamic/subject_area`,
      null,
      options,
    )
  }

  /**
   * Add/set dynamic metadata to an image
   *
   * See [the dynamic metadata chapter](https://rokka.io/documentation/references/dynamic-metadata.html) for
   * details.
   *
   * ```js
   * const result = await rokka.sourceimages.addDynamicMetaData('myorg', 'c421f4e8cefe0fd3aab22832f51e85bacda0a47a', 'crop_area', {
   *   x: 100,
   *   y: 100,
   *   width: 50,
   *   height: 50
   * }, {
   *   deletePrevious: false
   * })
   * ```
   *
   * @param organization - Organization name
   * @param hash - Image hash
   * @param name - The name of the dynamic metadata
   * @param data - The data to be sent. Usually an object
   * @param options - Optional: only {deletePrevious: true/false} yet, false is default
   * @returns Promise resolving to the updated source image
   */
  addDynamicMetaData(
    organization: string,
    hash: string,
    name: string,
    data: any,
    options: { deletePrevious?: string | boolean } = {},
  ): Promise<RokkaResponse> {
    options.deletePrevious = options.deletePrevious ? 'true' : 'false'
    return this.state.request(
      'PUT',
      `sourceimages/${organization}/${hash}/meta/dynamic/${name}`,
      data,
      options,
    )
  }

  /**
   * Delete dynamic metadata of an image
   *
   * See [the dynamic metadata chapter](https://rokka.io/documentation/references/dynamic-metadata.html) for
   * details.
   *
   * ```js
   * await rokka.sourceimages.deleteDynamicMetaData('myorg', 'c421f4e8cefe0fd3aab22832f51e85bacda0a47a', 'crop_area', {
   *   deletePrevious: false
   * })
   * ```
   *
   * @param organization - Organization name
   * @param hash - Image hash
   * @param name - The name of the dynamic metadata
   * @param options - Optional: only {deletePrevious: true/false} yet, false is default
   * @returns Promise resolving when the dynamic metadata is deleted
   */
  deleteDynamicMetaData(
    organization: string,
    hash: string,
    name: string,
    options: { deletePrevious?: string | boolean } = {},
  ): Promise<RokkaResponse> {
    options.deletePrevious = options.deletePrevious ? 'true' : 'false'
    return this.state.request(
      'DELETE',
      `sourceimages/${organization}/${hash}/meta/dynamic/${name}`,
      options,
    )
  }

  /**
   * Change the name of a source image.
   *
   * ```js
   * const result = await rokka.sourceimages.putName('myorg', 'c421f4e8cefe0fd3aab22832f51e85bacda0a47a', name)
   * ```
   *
   * @param organization - Organization name
   * @param hash - Image hash
   * @param name - New name of the image
   * @returns Promise resolving to the updated source image
   */
  putName(
    organization: string,
    hash: string,
    name: string,
  ): Promise<RokkaResponse> {
    return this.state.request(
      'PUT',
      `sourceimages/${organization}/${hash}/name`,
      JSON.stringify(name),
    )
  }
}

export type APISourceimages = SourceimagesApi

export default (state: State): { sourceimages: APISourceimages } => ({
  sourceimages: new SourceimagesApi(state),
})
