import Storage from './storage'

export default class StorageCookie extends Storage {

  _removeStorageState(key) {
    // eslint-disable-next-line
    const { [key]: value, ...withoutProp } = this._getStorageState()

    return this._setStorageState(key, withoutProp, 0)
  }

  _getStorageState(key) {
    const cookieDecoded = decodeURIComponent(document.cookie)
    const cookieArr = cookieDecoded.split('; ')
    const arrOffCookie = cookieArr.map(item => item.split('='))

    const cookieObj = arrOffCookie.reduce((acc, value) => {
      acc[value[0].trim()] = value[1].trim()
      return acc
    }, {})

    return key ? cookieObj[key] : cookieObj || {}
  }

  _setStorageState(key, value, expired = this.expirationPeriod) {
    let date = new Date()
    date.setTime(date.getTime() + expired)
    const expires = 'expires=' + date.toUTCString()
    document.cookie = `${key}=${value}; ${expires}; path=/`
  }
}
