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
import { State } from '../index'
import { RokkaResponse } from '../response'
import { StackOperation } from 'rokka-render'

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

export class OperationsApi {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any

  constructor(private state: State) {}

  resize(
    width: number,
    height: number,
    options: ResizeOperationsOptions = {},
  ): StackOperation {
    options.width = width
    options.height = height

    return {
      name: 'resize',
      options,
    }
  }

  autorotate(options: StackOperationOptions | undefined = {}): StackOperation {
    return {
      name: 'autorotate',
      options,
    }
  }

  rotate(angle: number, options: StackOperationOptions = {}): StackOperation {
    options.angle = angle

    return {
      name: 'rotate',
      options,
    }
  }

  dropshadow(options: StackOperationOptions = {}): StackOperation {
    return {
      name: 'dropshadow',
      options,
    }
  }

  trim(options: StackOperationOptions = {}): StackOperation {
    return {
      name: 'trim',
      options,
    }
  }

  crop(
    width: number,
    height: number,
    options: CropOperationsOptions = {},
  ): StackOperation {
    options.width = width
    options.height = height

    return {
      name: 'crop',
      options,
    }
  }

  noop(): StackOperation {
    return {
      name: 'noop',
    }
  }

  composition(
    width: number,
    height: number,
    mode: string,
    options: StackOperationOptions = {},
  ): StackOperation {
    options.width = width
    options.height = height
    options.mode = mode

    return {
      name: 'composition',
      options,
    }
  }

  blur(sigma: number, radius?: number): StackOperation {
    const options = { sigma, radius }

    return {
      name: 'blur',
      options,
    }
  }

  /**
   * Get a list of available stack operations.
   *
   * @example
   * ```js
   * const result = await rokka.operations.list()
   * ```
   *
   * @returns Promise resolving to the list of operations
   */
  list(): Promise<RokkaResponse> {
    return this.state.request('GET', 'operations', null, null, {
      noAuthHeaders: true,
    })
  }
}

export type Operations = OperationsApi

export default (state: State): { operations: Operations } => ({
  operations: new OperationsApi(state),
})
