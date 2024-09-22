export const BTC_USD = '0xc907e116054ad103354f2d350fd2514433d57f6f'
export const ETH_USD = '0xf9680d99d6c9589e2a93a78a04a279e509205945'
export const SOL_USD = '0x10c8264c0935b3b9870013e057f330ff3e9c56dc'
export const BNB_USD = '0x82a6c4af830caa6c97bb504425f6a66165c2c26e'

export const CRYPTO = 'CRYPTO'
export const EQUITIES = 'EQUITIES'
export const FOREX = 'FOREX'

export const PRICEFEED = {
  BTC_USD: BTC_USD,
  ETH_USD: ETH_USD,
  SOL_USD: SOL_USD,
  BNB_USD: BNB_USD,

  BASE: {
    [BTC_USD]: 'BTC',
    [ETH_USD]: 'ETH',
    [SOL_USD]: 'SOL',
    [BNB_USD]: 'BNB',
  },
  QUOTE: {
    [BTC_USD]: 'USD',
    [ETH_USD]: 'USD',
    [SOL_USD]: 'USD',
    [BNB_USD]: 'USD',
  },
  DECIMALS: {
    [BTC_USD]: 8,
    [ETH_USD]: 8,
    [SOL_USD]: 8,
    [BNB_USD]: 8,
  },
  CL_URL: {
    [BTC_USD]: 'https://data.chain.link/polygon/mainnet/crypto-usd/btc-usd',
    [ETH_USD]: 'https://data.chain.link/polygon/mainnet/crypto-usd/eth-usd',
    [SOL_USD]: 'https://data.chain.link/polygon/mainnet/crypto-usd/sol-usd',
    [BNB_USD]: 'https://data.chain.link/polygon/mainnet/crypto-usd/bnb-usd',
  },
  CATEGORY: {
    [BTC_USD]: CRYPTO,
    [ETH_USD]: CRYPTO,
    [SOL_USD]: CRYPTO,
    [BNB_USD]: CRYPTO,
  }
}
