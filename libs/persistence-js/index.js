import logger from '../logger'

import Factory from './factory'

export default class Persistence {
  static init(config) {
    logger.info('Starting initialization')

    if (config.storages) {
      let totalState = {}

      for (const storageName in config.storages) {
        // eslint-disable-next-line
        const { storages, ...globalConfig } = config
        const storageCfg = { ...config.storages[storageName], storageName: storageName }
        const cfg = { ...globalConfig, ...storageCfg }

        if (!Persistence[storageName]) Persistence[storageName] = Factory.create(cfg)

        Persistence[storageName].storageCleanUp()

        const state = Persistence[storageName].get()
        totalState = { ...totalState, ...state }
      }

      return totalState
    } else {
      const cfg = { ...config, storageName: 'instance' }
      if (!Persistence.instance) Persistence.instance = Factory.create(cfg)

      Persistence.instance.storageCleanUp()

      return Persistence.instance.get()
    }
  }
}

