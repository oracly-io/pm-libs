export const WMATIC = 'WMATIC'
export const ORCY = 'ORCY'
export const DEMO = 'DEMO'
export const USDC = 'USDC'
export const USDT = 'USDT'
export const WETH = 'WETH'
export const WBTC = 'WBTC'
export const UNKNOWN = 'UNKNOWN'

export const ORCY_ADDRESS = '0x8def651cbf7deaa35835ed6d4a4d4daabb8b898b'
export const DEMO_ADDRESS = '0xde41431172704248b723a36d00044f8132fa444e'
export const USDC_ADDRESS = '0x3c499c542cef5e3811e1192ce70d8cc03d5c3359'
export const USDT_ADDRESS = '0xc2132d05d31c914a87c6611c10748aeb04b58e8f'
export const WETH_ADDRESS = '0x7ceb23fd6bc0add59e62ac25578270cff1b9f619'
export const WBTC_ADDRESS = '0x1bfd67037b42cf73acf2047067bd4f2c47d9bfd6'
export const WMATIC_ADDRESS = '0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270'

export const ERC20 = {
  ORCY: ORCY_ADDRESS,
  DEMO: DEMO_ADDRESS,
  USDC: USDC_ADDRESS,
  USDT: USDT_ADDRESS,
  WETH: WETH_ADDRESS,
  WBTC: WBTC_ADDRESS,
  WMATIC: WMATIC_ADDRESS,

  [ORCY_ADDRESS]: ORCY,
  [DEMO_ADDRESS]: DEMO,
  [USDC_ADDRESS]: USDC,
  [USDT_ADDRESS]: USDT,
  [WETH_ADDRESS]: WETH,
  [WBTC_ADDRESS]: WBTC,
  [WMATIC_ADDRESS]: WMATIC,

  SYMBOL: {
    [ORCY]: ORCY,
    [DEMO]: DEMO,
    [USDC]: USDC,
    [USDT]: USDT,
    [WETH]: WETH,
    [WBTC]: WBTC,
    [WMATIC]: WMATIC,
  },
  ADDRESS: {
    [ORCY]: ORCY_ADDRESS,
    [DEMO]: DEMO_ADDRESS,
    [USDC]: USDC_ADDRESS,
    [USDT]: USDT_ADDRESS,
    [WETH]: WETH_ADDRESS,
    [WBTC]: WBTC_ADDRESS,
    [WMATIC]: WMATIC_ADDRESS,
  },
  DECIMALS: {
    [ORCY]: 18,
    [DEMO]: 18,
    [USDC]: 6,
    [USDT]: 6,
    [WETH]: 18,
    [WBTC]: 18,
    [WMATIC]: 18,
  },
  DESCRIPTION: {
    [ORCY]: 'Oracly Coin',
    [DEMO]: 'Oracly Demo Coin',
    [USDC]: 'USD Coin',
    [USDT]: 'Tether',
    [WETH]: 'Wrapped Ether',
    [WBTC]: 'Wrapped Bitcoin',
    [WMATIC]: 'Wrapped MATIC',
  },
  SYMBOLS: [
    USDT,
    USDC,
    ORCY,
    DEMO,
    WETH,
    WBTC,
    WMATIC,
  ]
}
