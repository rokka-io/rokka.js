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
    async _getJson () {
      return this.response.json()
    },
    async _getBody () {
      if (this.response.headers && this.response.json) {
        if (this.response.headers.get('content-type') === 'application/json') {
          return this._getJson()
        }
        return this._getText()
      }
      return this.response.body
    },
    async _getText () {
      return this.response.text()
    }
  }
  return response
}
