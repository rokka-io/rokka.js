export default (originalResponse = {}) => {
  const response = {
    response: originalResponse,
    body: null,
    get statusCode () {
      return this.response.status
    },
    get statusMessage () {
      return this.response.statusText
    },
    async getBody () {
      return this.response.json()
    },
    async getText () {
      return this.response.text()
    }
  }
  return response
}
