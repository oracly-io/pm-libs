export const MAINNET = 1
export const ROPSTEN = 3
export const RINKEBY = 4
export const GOERLI = 5
export const KOVAN = 42

export const ARBITRUM_ONE = 42161
export const ARBITRUM_RINKEBY = 421611

export const OPTIMISM = 10
export const OPTIMISM_GOERLI = 420

export const BINANCE = 56
export const BINANCE_TEST = 97

export const POLYGON = 137
export const POLYGON_MUMBAI = 80001

export const CELO = 42220
export const CELO_ALFAJORES = 44787

export const LDE = process.env.WEB3_LDE_CHAIN_ID
export const LDE_URL = process.env.WEB3_LDE_CHAIN_URL

export const NETWORK = LDE || POLYGON

export const NETWORK_URLS = {
  READ: {
    [POLYGON]: [
      'https://polygon-mainnet.rpcfast.com?api_key=xbhWBI1Wkguk8SNMu1bvvLurPGLXmgwYeC4S6g2H7WdwFigZSmPWVZRxrskEQwIf',  // ??
      'https://polygon.drpc.org',                                                                                      // ??
      'https://1rpc.io/matic',                                                                                         // ??
      'https://polygon-mainnet.public.blastapi.io',                                                                    // ??
      'https://endpoints.omniatech.io/v1/matic/mainnet/public',                                                        // ??
      'https://gateway.tenderly.co/public/polygon',                                                                    // ??

      'https://rpc.ankr.com/polygon',                   // ~90% success
      'https://polygon.blockpi.network/v1/rpc/public',  // ~99% success
      'https://polygon.api.onfinality.io/public',       // ~99% success
      'https://polygon.gateway.tenderly.co',            // ~95% success
      'https://polygon.rpc.subquery.network/public',    // ~99% success
      'https://rpc-mainnet.matic.quiknode.pro',         // ~99% success
      //
	  // 'https://polygon-mainnet.4everland.org/v1/37fa9972c1b1cd5fab542c7bdd4cde2f', // ~80%
      // 'https://polygon.rpc.blxrbdn.com',             // ~60% success
      // 'https://polygon-bor-rpc.publicnode.com        // ~60% success
      // 'https://polygon-pokt.nodies.app',             // ~65% success
      // 'https://polygon.llamarpc.com',                // ~60% success
      // 'https://polygon.meowrpc.com',                 // ~60% success
      // 'https://api.zan.top/node/v1/polygon/mainnet/public',                        // 0%

    ],
    [POLYGON_MUMBAI]: [
      'https://rpc-mumbai.matic.today',
    ],
    [MAINNET]: [
      'https://eth.public-rpc.com',
    ],
    [LDE]: [
      LDE_URL,
    ],
  },
  WRITE: {
    [POLYGON]: [
      'https://polygon-rpc.com',                        // ~97% success
    ],
    [POLYGON_MUMBAI]: [
      'https://rpc-mumbai.matic.today',
    ],
    [MAINNET]: [
      'https://eth.public-rpc.com',
    ],
    [LDE]: [
      LDE_URL,
    ],
  },
}

export const SCANNER_URLS = {
  [POLYGON]: 'https://polygonscan.com',
  [POLYGON_MUMBAI]: 'https://mumbai.polygonscan.com',
  [MAINNET]: 'https://etherscan.io',
  [LDE]: LDE_URL,
}

export const SUPPORTED_CHAIN_IDS = [
  MAINNET,
  ROPSTEN,
  RINKEBY,
  GOERLI,
  KOVAN,

  ARBITRUM_ONE,
  ARBITRUM_RINKEBY,

  OPTIMISM,
  OPTIMISM_GOERLI,

  BINANCE,
  BINANCE_TEST,

  POLYGON,
  POLYGON_MUMBAI,

  CELO,
  CELO_ALFAJORES,
]
