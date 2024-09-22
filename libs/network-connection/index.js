import logger from '../logger'


const isOnLine = () => window && window.navigator && window.navigator.onLine

export function addConnectionListener(listener) {
  if (typeof listener !== 'function') return

  const handler = (event) => {
    if (event.type === 'online') listener(isOnLine())
    if (event.type === 'offline') listener(isOnLine())

    logger.info('Connecation status get changed:', event.type)
  }

  listener(isOnLine())
  window.addEventListener('online', handler)
  window.addEventListener('offline', handler)

  return () => {
    window.removeEventListener('online', handler)
    window.removeEventListener('offline', handler)
  }
}
