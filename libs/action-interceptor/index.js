import { isFunction } from 'lodash'

import logger from '@libs/logger'

export function interceptorMiddleware(interceptors) {
  return store => next => action => {

    for (const name in interceptors) {
      const interceptor = interceptors[name]

      if (!isFunction(interceptor.detect)) continue
      if (!isFunction(interceptor.intercept)) continue

      const detected = interceptor.detect(action, store)
      if (!detected) continue

      logger.info('Action "%s" was detected by "%s", intercepting!', action.type, name)

      interceptor.intercept(action, store)
    }

    if (!action.metadata.stopPropagation) return next(action)
  }
}
