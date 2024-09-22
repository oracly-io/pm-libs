import logger from '../logger'

export class SocketClient {

  constructor(config) {
    this.baseUrl = config.baseUrl
    this.onMessageReceived = config.onMessageReceived
    this.onConnectionOpened = config.onConnectionOpened
    this.onConnectionClosed = config.onConnectionClosed
  }

  connect = () => {
    logger.info('ws connecting to: %s', this.baseUrl)

    this._wsClient = new WebSocket(this.baseUrl)
    this._wsClient.onerror = this.#onError
    this._wsClient.onopen = this.#onOpen
    this._wsClient.onmessage = this.#onMessage
    this._wsClient.onclose = this.#onClose
  }

  #onError = (e) => {
    logger.error(e)
  }

  #onClose = () => {
    logger.info('ws closing connection! url: %s', this.baseUrl)

    if (this.onConnectionClosed) this.onConnectionClosed()
  }

  #onOpen = () => {
    logger.info('ws successfully opened! url: %s', this.baseUrl)

    if (this.onConnectionOpened) this.onConnectionOpened()
  }

  #onMessage = ({ data }) => {
    logger.info('ws message received: %s', data)

    const msg = this.#parse(data)
    if (msg && this.onMessageReceived) this.onMessageReceived(msg)
  }

  #parse(rawdata) {
    try {
      return JSON.parse(rawdata)
    } catch (ex) {
      logger.error(ex)
    }
    return {}
  }

  send = (data) => new Promise((resolve, reject) => {
    const msg = JSON.stringify(data)

    logger.info('ws message sent: %s', msg)

    if (!this._wsClient) {
      logger.error('ws failed to send message, no websocket client')
      reject()
    }

    if (this._wsClient.readyState !== WebSocket.OPEN) {
      logger.error('ws failed to send message, connection is not opened')
      reject()
    }

    this._wsClient.send(msg)
    resolve()
  })
}
