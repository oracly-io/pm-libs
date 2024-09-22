import { get } from 'lodash'

export default class KeyChain {

  constructor (config) {
    if (!config.storageId || !config.appName || !config.storageName) {
      throw new Error('Could not initialize persistence, missing config!')
    }

    this.appName = config.appName
    this.storageId = config.storageId
    this.storageName = config.storageName
    this.resource = config.resource
    this.lifeTime = config.lifeTime || 365 //days
    this.lifeTimeMs = this.lifeTime * 24 * 60 * 60 * 1000
  }

  findInvalidKeys(allKeys) {
    const decoratedKeys = this._buildDecoratedKeys(allKeys)
    const validKey = this._findValidKey(decoratedKeys)

    const invalidKeys = decoratedKeys.filter(key => (
      key.isAppKey && this._isKeyExpired(key) ||
      key.isInstanceKey && validKey !== get(key, 'key')
    ))

    const result = invalidKeys.map(decoratedKey => decoratedKey.key)
    return result
  }

  findValidKey(allKeys) {
    const decoratedKeys = this._buildDecoratedKeys(allKeys)
    return this._findValidKey(decoratedKeys)
  }

  _findValidKey(decoratedKeys) {
    const validKeys = decoratedKeys.filter(key =>
      key.isInstanceKey && !this._isKeyExpired(key)
    )

    const latestKey = this._getLatestKey(validKeys)
    const validKey = get(latestKey, 'key', this.generateKey())

    return validKey
  }

  getAllAppKeys(allKeys) {
    const decoratedKeys = this._buildDecoratedKeys(allKeys)
    const appKeys = decoratedKeys.filter(key => key.isAppKey)

    return appKeys.map(decoratedKey => decoratedKey.key)
  }

  generateKey() {
    return `__${this.appName}__state__${this.storageName}__${this.storageId}__${Date.now() + this.lifeTimeMs}`
  }

  _isKeyExpired(deckey) {
    return get(deckey, 'timestamp', 0) < Date.now()
  }

  _buildDecoratedKeys(allKeys){
    allKeys = allKeys || []
    const apprex = this._getAppKeyRex(allKeys)
    const insrex = this._getInstanceKeyRex()
    const decoratedKeys = allKeys.map(key => ({
      key: key,
      isAppKey: apprex.test(key),
      isInstanceKey: insrex.test(key),
      timestamp: +get(apprex.exec(key), 1, 0)
    }))
    return decoratedKeys
  }

  _getLatestKey(keys) {
    return keys.reduce((latest, current) =>
      get(latest, 'timestamp') > get(current, 'timestamp') ? latest : current
    , get(keys, 0))
  }

  _getInstanceKeyRex() {
    return new RegExp(`_${this.appName}__state__${this.storageName}__${this.storageId}__.*?_?_?([^_]*)$`)
  }

  _getAppKeyRex() {
    return new RegExp(`_${this.appName}__state__.*?_?_?([^_]*)$`)
  }
}
