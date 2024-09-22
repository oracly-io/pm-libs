import { SocketClient } from './SocketClient'

export class ChatSocket extends SocketClient {

  constructor() {
    super({
      baseUrl: ChatSocket.baseUrl,
      onMessageReceived: ChatSocket.onMessageReceived,
      onConnectionOpened: ChatSocket.onConnectionOpened,
      onConnectionClosed: ChatSocket.onConnectionOpened,
    })
  }

}
