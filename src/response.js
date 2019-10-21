export default (originalResponse = {}) => {
  const response = {
    response: originalResponse,
    body: null,
    get statusCode () {
      return this.response.status
    },
    get statusMessage () {
      return this.response.statusText
    }
  }
  return response
}
