export interface Response {
  response: any
  body: any
  statusCode: number
  statusMessage: string
  error?: any
  message?: string
}

export default (originalResponse = {}): Response => {
  const response = {
    response: originalResponse,
    body: null,
    get statusCode() {
      return this.response.status
    },
    get statusMessage() {
      return this.response.statusText
    }
  }
  return response
}
