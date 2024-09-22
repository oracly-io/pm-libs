import { get } from 'lodash'

import { STORAGE_LOCAL, STORAGE_COOKIE } from './storage'
import StorageCookie from './storage-cookie'
import StorageLocal from './storage-local'

import logger from '../logger'


export default class Factory {
  static create(storageCfg) {
    logger.info('Creating storage', storageCfg)
    const resource = get(storageCfg, 'resource')
    if (resource === STORAGE_LOCAL) return new StorageLocal(storageCfg)
    if (resource === STORAGE_COOKIE) return new StorageCookie(storageCfg)

    return new StorageLocal(storageCfg)
  }
}
