export interface Response {
  response: any
  body: any
  statusCode: number
  statusMessage: string
  error?: any
  message?: string
}

export interface OriginalResponse {
  status: number
  statusText: string
}

export default (originalResponse: OriginalResponse): Response => {
  return {
    response: originalResponse,
    body: null,
    get statusCode() {
      return this.response.status
    },
    get statusMessage() {
      return this.response.statusText
    }
  }
}
