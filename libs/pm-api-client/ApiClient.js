import { isObject, toString, compact } from 'lodash'

import { GET, POST, PUT, DELETE } from './verbs'

export class ApiClient {

  constructor(baseUrl) {
    this.baseUrl = baseUrl
  }

  get(url, params) {
    if (isObject(url)) {
      params = url
      url = null
    }

    return this.#request(GET, this.#buildUrl(url + '?' + new URLSearchParams(params)), null)
  }

  post(url, params) {
    if (isObject(url)) {
      params = url
      url = null
    }

    return this.#request(POST, this.#buildUrl(url), params)
  }

  put(url, params) {
    if (isObject(url)) {
      params = url
      url = null
    }

    return this.#request(PUT, this.#buildUrl(url), params)
  }

  delete(url, params) {
    if (isObject(url)) {
      params = url
      url = null
    }

    return this.#request(DELETE, this.#buildUrl(url), params)
  }

  #concatUrl(...args) {
    let res = compact(args).join('/')

    let prefix = ''
    if (/^\/\//.test(res)) prefix='//'

      res = res
      .replace(/\/\//g, '/')
      .replace(/\/\//g, '/')
      .replace(/:\//g, '://')

      return prefix + res
  }

  #buildUrl(url) {
    return this.#concatUrl(this.baseUrl, toString(url))
  }

  #request(method, url, params) {
    return window.fetch(url, {
      headers: {
        'accept': 'application/json, text/plain, */*',
      },
      referrerPolicy: 'strict-origin-when-cross-origin',
      body: params ? JSON.stringify(params) : params,
      method: method,
      mode: 'cors',
      credentials: 'omit'
    })
    .then(async r => {
      const body = JSON.parse(await r.text())
      return r.ok
        ? body
        : Promise.reject(body?.error || body)
    })
    .catch(err =>
       Promise.reject(err)
    )
  }
}
