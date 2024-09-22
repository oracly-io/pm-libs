import { isMobileEnv } from '@libs/env-utils'

export function initForceRefreshBetweenAppsNavigation(config) {
  if (!isMobileEnv(config)) return

  function forceRefresh() {
    const baseUrl = `/${window.location?.pathname?.split('/')?.[1]}`

    if (![config.pm_base_path, config.st_base_path, config.mt_base_path].includes(baseUrl)) return
    if (baseUrl === config.pm_base_path) return

    window.location?.reload && window.location?.reload()
  }

  window.addEventListener('popstate', forceRefresh)

  return () => {
    window.removeEventListener('popstate', forceRefresh)
  }
}