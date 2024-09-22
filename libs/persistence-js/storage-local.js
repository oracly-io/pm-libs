import Storage from './storage'

export default class StorageLocal extends Storage {

  _getStorageState(key) {
    return key
      ? localStorage.getItem(key)
      : localStorage
  }

  _removeStorageState(key) {
    localStorage.removeItem(key)
  }

  _setStorageState(key, value) {
    localStorage.setItem(key, value)
  }
}
