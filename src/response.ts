export interface RokkaResponse {
  response: Response
  body: any
  statusCode: number
  statusMessage: string
  error?: any
  message?: string
}

export interface RokkaListResponseBody {
  total: number
  cursor?: string
  links?: {
    next?: { href: string }
    prev?: { href: string }
  }
  items: any[]
}

export interface RokkaListResponse extends RokkaResponse {
  body: RokkaListResponseBody
}

export default (originalResponse: Response): RokkaResponse => {
  return {
    response: originalResponse,
    body: null,
    get statusCode() {
      return this.response.status
    },
    get statusMessage() {
      return this.response.statusText
    },
  }
}
