import { ApiClient } from './ApiClient'

export class UserApi extends ApiClient {

  constructor(baseUrl) {
    super(UserApi.baseUrl)
  }

  getNickname = ({ address }) => {
    return this.get(`/${address}/nickname`, { t: Math.floor(Date.now() / 1000) })
  }

}

