import { set } from 'lodash'

import logger from '../logger'

import KeyChain from './key-chain'

export const STORAGE_LOCAL = 'local'
export const STORAGE_COOKIE = 'cookie'

export default class Storage {

  constructor (config) {
    this.default = {}
    this.keyChain = new KeyChain(config)
  }

  get() {
    const storageKey = this._getStorageKey()
    try {

      const state = this._getStorageState(storageKey)
      return state === null
        ? this.default
        : JSON.parse(state)

    } catch (e) {
      logger.info('Persistence detect corrupted state, resetting to default', e)

      this._setStorageState(storageKey, JSON.stringify(this.default))

      return this.default
    }
  }

  set(path, value) {
    const storageKey = this._getStorageKey()
    const state = this.get()

    try {
      let newState = value || this.default
      if (path) newState = set(state, path, value)
      this._setStorageState(storageKey, JSON.stringify(newState))
    } catch (e) {
      logger.info('Storage state could not be saved!', e)

      //clean up all keys except current storage key
      this.clearStorageExceptCurrentKey(storageKey)
    }
  }

  clearStorageExceptCurrentKey(key) {
    const allKeys = this._getAllKeys()
    const allAppKeys = this.keyChain.getAllAppKeys(allKeys)

    for (const idx in allAppKeys) {
      if (key !== allAppKeys[idx]) {
        this._removeStorageState(allAppKeys[idx])
      }
    }
  }

  storageCleanUp() {
    const allKeys = this._getAllKeys()
    const invalidKeys = this.keyChain.findInvalidKeys(allKeys)

    for (const idx in invalidKeys) {
      this._removeStorageState(invalidKeys[idx])
    }
  }

  _getStorageKey() {
    const allKeys = this._getAllKeys()
    const storageKey = this.keyChain.findValidKey(allKeys)

    return storageKey
  }

  _getAllKeys() {
    const allKeys = []
    for (const key in this._getStorageState()) {
      allKeys.push(key)
    }
    return allKeys
  }
}
