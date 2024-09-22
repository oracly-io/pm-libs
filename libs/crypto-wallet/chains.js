import { POLYGON, POLYGON_MUMBAI, LDE }from './constants'
import { NETWORK_URLS, SCANNER_URLS }from './constants'
import { toHex } from './utils'

const chains = {
  [toHex(POLYGON)]: {
    'chainId': toHex(POLYGON),
    'chainName': 'Polygon',
    'nativeCurrency': {
      'name': 'Polygon Ecosystem Token',
      'symbol': 'POL',
      'decimals': 18
    },
    'rpcUrls': NETWORK_URLS.WRITE[POLYGON],
    'blockExplorerUrls': [SCANNER_URLS[POLYGON]]
  },
  [toHex(POLYGON_MUMBAI)]: {
    'chainId': toHex(POLYGON_MUMBAI),
    'chainName': 'Polygon Mumbai',
    'name': 'Polygon Mumbai',
    'nativeCurrency': {
      'name': 'Polygon Ecosystem Token',
      'symbol': 'POL',
      'decimals': 18
    },
    'rpcUrls': NETWORK_URLS.WRITE[POLYGON_MUMBAI],
    'blockExplorerUrls': [SCANNER_URLS[POLYGON_MUMBAI]]
  },
  [toHex(LDE)]: {
    'chainId': toHex(LDE),
    'chainName': 'Polygon LDE',
    'nativeCurrency': {
      'name': 'Polygon Ecosystem Token',
      'symbol': 'POL',
      'decimals': 18
    },
    'rpcUrls': NETWORK_URLS.WRITE[LDE],
    'blockExplorerUrls': ['https://polygonscan.com']
  },

}

export default chains
