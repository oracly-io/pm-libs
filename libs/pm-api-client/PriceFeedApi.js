import { ApiClient } from './ApiClient'

export class PriceFeedApi extends ApiClient {

  constructor(baseUrl) {
    super(PriceFeedApi.baseUrl)
  }

  getLatest = ({ pricefeed }) => {
    return this.get(`/pricefeed/${pricefeed}/latest/`)
  }

  getSettlments = ({ pricefeed, settlmentids }) => {
    return this.get(`/settlment/${pricefeed}`, { ids: settlmentids })
  }

  getRounds = ({ pricefeed, from, to, sampling }) => {
    return this.get(`/pricefeed/${pricefeed}/`, {
      f: from,
      t: to,
      s: sampling
    })
  }

}
