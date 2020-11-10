/**
 * ### Operations
 *
 * #### Available operations
 *
 * - `rokka.operations.resize(width, height, options = {})`
 * - `rokka.operations.autorotate(options = {})`
 * - `rokka.operations.rotate(angle, options = {})`
 * - `rokka.operations.dropshadow(options = {})`
 * - `rokka.operations.trim(options = {})`
 * - `rokka.operations.crop(width, height, options = {})`
 * - `rokka.operations.noop()`
 * - `rokka.operations.composition(width, height, mode, options = {})`
 * - `rokka.operations.blur(sigma, radius)`
 *
 * Please refer to the
 * [rokka API documentation](https://rokka.io/documentation/references/operations.html)
 *
 * @module operations
 */
import { StackOperation } from './stacks'
import { State } from '../index'
import { RokkaResponse } from '../response'

export interface StackOperationOptions {
  [key: string]: string | number | boolean | undefined | null
  enabled?: boolean
}
export enum ResizeMode {
  Box = 'box',
  Fill = 'fill',
  Absolute = 'absolute',
}

export interface ResizeOperationsOptions extends StackOperationOptions {
  width?: number
  height?: number
  mode?: ResizeMode
  upscale?: boolean
  upscale_dpr?: boolean
}

export interface CropOperationsOptions extends StackOperationOptions {
  width?: number
  height?: number
  anchor?: string
  fallback?: string
  mode?: string
  area?: string
  scale?: number
}

export enum CompositionMode {
  Foreground = 'foreground',
  Background = 'background',
}

export interface CompositionOperationsOptions extends StackOperationOptions {
  width?: number
  height?: number
  mode?: CompositionMode
  resize_mode?: ResizeMode
  anchor?: string
  resize_to_primary?: boolean
  secondary_color?: string
  secondary_opacity?: number
  secondary_image?: string
}

export interface Operations {
  [key: string]: Function
  resize(
    width: number,
    height: number,
    options?: ResizeOperationsOptions,
  ): StackOperation
  autorotate(options?: StackOperationOptions): StackOperation
  rotate(angle: number, options?: StackOperationOptions): StackOperation
  dropshadow(options?: StackOperationOptions): StackOperation
  trim(options?: StackOperationOptions): StackOperation
  noop(): StackOperation
  crop(
    width: number,
    height: number,
    options?: CropOperationsOptions,
  ): StackOperation
  composition(
    width: number,
    height: number,
    mode: string,
    options?: CompositionOperationsOptions,
  ): StackOperation
  blur(sigma: number, radius?: number): StackOperation
  list(): Promise<RokkaResponse>
}

export default (state: State): { operations: Operations } => {
  const operations: Operations = {
    resize: (
      width: number,
      height: number,
      options: ResizeOperationsOptions = {},
    ): StackOperation => {
      options.width = width
      options.height = height

      return {
        name: 'resize',
        options,
      }
    },
    autorotate: (
      options: StackOperationOptions | undefined = {},
    ): StackOperation => {
      return {
        name: 'autorotate',
        options,
      }
    },
    rotate: (
      angle: number,
      options: StackOperationOptions = {},
    ): StackOperation => {
      options.angle = angle

      return {
        name: 'rotate',
        options,
      }
    },
    dropshadow: (options: StackOperationOptions = {}): StackOperation => {
      return {
        name: 'dropshadow',
        options,
      }
    },
    trim: (options: StackOperationOptions = {}): StackOperation => {
      return {
        name: 'trim',
        options,
      }
    },
    crop: (
      width: number,
      height: number,
      options: CropOperationsOptions = {},
    ): StackOperation => {
      options.width = width
      options.height = height

      return {
        name: 'crop',
        options,
      }
    },
    noop: (): StackOperation => {
      return {
        name: 'noop',
      }
    },
    composition: (
      width: number,
      height: number,
      mode: string,
      options: StackOperationOptions = {},
    ): StackOperation => {
      options.width = width
      options.height = height
      options.mode = mode

      return {
        name: 'composition',
        options,
      }
    },
    blur: (sigma: number, radius: number): StackOperation => {
      const options = { sigma, radius }

      return {
        name: 'blur',
        options,
      }
    },

    /**
     * Get a list of available stack operations.
     *
     * ```js
     * rokka.operations.list()
     *   .then(function(result) {})
     *   .catch(function(err) {});
     * ```
     *
     * @return {Promise}
     */
    list: (): Promise<RokkaResponse> => {
      return state.request('GET', 'operations', null, null, {
        noAuthHeaders: true,
      })
    },
  }
  return {
    operations,
  }
}
