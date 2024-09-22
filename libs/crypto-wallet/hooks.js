import { Connectors, useWeb3React, WalletConnect, Network, MetaMask } from '@oracly/pm-wallet'
import { getConnName, getAddChainParameters } from '@oracly/pm-wallet'

import { isFunction } from 'lodash'
import { useEffect, useCallback, useState, useRef, useMemo } from 'react'
import { Contract } from 'ethers'

import { DEFAULT_WEB3_PROVIDER } from './default-web3-provider'
import IERC20 from './abis/@openzeppelin/IERC20.json'
import { NETWORK } from './constants'
import { toHex } from './utils'
import chains from './chains'

const logError = (error) => console.error(error) // eslint-disable-line

let WEB3_PROVIDER = DEFAULT_WEB3_PROVIDER

let isAuthorized = false
let SIGNER = null
let authSigner = null
let auth = (new Promise((res, rej) => { authSigner = res })).catch(logError)

export const web3client = {
  __cache: { },
  waitForTransaction: (hash) => WEB3_PROVIDER.waitForTransaction(hash),
  request: async (args) => {
    const signer = await auth
    if (isAuthorized && signer) {
      return WEB3_PROVIDER.send(args.method, args.params)
    }
  },
  getBalance: (address, args) => {
    if (address) {
      return DEFAULT_WEB3_PROVIDER.getBalance(address, args)
    }
  },
  call: (...args) => WEB3_PROVIDER.call(...args),
  sendTransaction: async (...args) => {
    const signer = await auth
    if (isAuthorized && signer) {
      return signer.sendTransaction(...args)
    }
  },
  get: (address, abi, options) => {
    if (address && abi) {
      let singer = SIGNER
      if (options?.readonly) singer = null

      const cachekey = address + String(singer ? singer.address : '')
      if (!web3client.__cache[cachekey]) {
        web3client.__cache[cachekey] = web3client.create(address, abi, singer)
      }

      return web3client.__cache[cachekey]

    } else {
      if (!abi) logError('abi in missing!')
    }
  },
  create: (address, abi, signer) => {
    if (address && abi) {
      if (isAuthorized && signer) return new Contract(address, abi, signer)
      else                        return new Contract(address, abi, DEFAULT_WEB3_PROVIDER)
    } else {
      if (!abi) logError('abi in missing!')
    }
  },
}

const useERC20Client = (call, erc20, interval, chainId, account) => {

  const web3React = useWeb3React()
  chainId = chainId || web3React.chainId
  account = account || web3React.account

  const [result, setResult] = useState()

  const __effectify = (onResult, onError, fn) =>
    async () => {
      let cancel = false
      try {
        const result = await fn()
        !cancel && onResult && onResult(result)
      }
      catch (error) {
        onError && onError(error)
      }
      return () => cancel = true
    }

  const [tick, setTick] = useState(0)
	useEffect(() => {
    if (!interval) return

    let variation = 1
    const TIMERID = setInterval(
      () => {
        setTick(variation)
        variation = ~variation
      },
      interval
    )

    return () => {
      clearInterval(TIMERID)
    }
  }, [interval])

  useEffect(() => {
    setResult(void 0)
  }, [erc20])

  useEffect(
    __effectify(setResult, logError,
      async () => {
        if (account && toHex(chainId) in chains) {
          const erc20client = web3client.get(erc20, IERC20.abi)
          if (call && erc20client) return await call({
            erc20client,
            account,
            chainId,
          })
        }
      }
    )
  , [account, chainId, tick, erc20])

  return result

}

export const useAllowance = (erc20, contract, interval) => {

  return useERC20Client(
    async ({ erc20client, account }) => {
      return (await erc20client.allowance(account, contract)).toString()
    },
    erc20, interval
  )

}

export const useBalance = (erc20, interval) => {

  return useERC20Client(
    async ({ erc20client, account }) => {
      return (await erc20client.balanceOf(account)).toString()
    },
    erc20, interval
  )

}

export const useWallet = (autoSelectChain = true) => {
  const web3React = useWeb3React()
  const ethprovider = web3React.provider?.provider

  const [ready, setReady] = useState()

  const action = useRef()
  const __actionize = useCallback((name, fn) => (
    {
      [name]: async (...args) => {
        try {

          // some action is still in progress
          if (action.current && !action.current.error) throw new Error(`Action "${action.current.name}" is still in progress!`)

          action.current = { name }
          await fn(...args)
          action.current = null
        }
        catch (error) {
          // swallow errors
          action.current = { name, error }
          // switch chain is pending swallow error, other reset()
          // if (error.code !== -32002) web3React.reset()
        }
      }
    }
  ), [action, web3React])

  const actions = useRef()
  actions.current = useMemo(() => ({
    ...__actionize('disconnect',
      async () => {
        await Promise.all(Connectors
          .map(([conn, hooks]) => {
            if (conn.deactivate) return conn.deactivate()
            else return conn.resetState()
          })
        )
        window.localStorage.removeItem('__connector')
        web3client.__cache = {}
        isAuthorized = false
      }
    ),
    ...__actionize('connect',
      async (connectorId) => {
        let c = Connectors.find(([conn, hooks]) => connectorId === getConnName(conn))
        if (c) {
          const [connector,] = c
          if (!(window.ethereum) && connectorId === 'injected') {
            window.open('https://wallet.uniswap.org/', '_blank')
          } else {

            if (connector?.deactivate) void connector.deactivate()
            else                       void connector.resetState()

            if (
              connector instanceof WalletConnect ||
              connector instanceof Network
            ) {
              await connector.activate(NETWORK)
            } else if (
              // NOTE: Workaround known issue with MetaMask wallet extention
              // https://github.com/MetaMask/metamask-extension/issues/10085
              connector instanceof MetaMask
            ) {
              try {
                await connector.activate(getAddChainParameters(NETWORK))
              } catch (e) {
                if (e.code !== -32002) throw e

                // NOTE: suggested work around to reopen MetaMask pop-up
                try {
                  await WEB3_PROVIDER.send(
                    'wallet_requestPermissions',
                    [{ eth_accounts: {} }],
                  )

                  await connector.activate(getAddChainParameters(NETWORK))
                } catch (e) {
                  // NOTE: reopen attemps shows that MetaMask pop-up sill open
                  if (e.code !== -32002) throw e

                  // NOTE: here we hung wallet activate promise
                  // in order to notify dApp about progress on MetaMask side hung context
                  await (new Promise(() => {})) // eslint-disable-line
                }

              }
            } else {
              await connector.activate(getAddChainParameters(NETWORK))
            }

            window.localStorage.setItem('__connector', connectorId)

            web3client.__cache = {}
            isAuthorized = true
          }
        } else {
          web3client.__cache = {}
          isAuthorized = false
          throw new Error(`Unsupported connector "${connectorId}"`)
        }
      }
    ),
    ...__actionize('connectEagerly',
      async () => {
        const cname = window.localStorage.getItem('__connector')
        if (!web3React.isActive && cname) {
          const c = Connectors.find(([conn, hooks]) => cname === getConnName(conn))
          if (c) {
            const [connector] = c
            await connector.connectEagerly()
            web3client.__cache = {}
            isAuthorized = true
          }
        }
      }
    ),
    ...__actionize('setChain',
      async (chainid) => {
        chainid = toHex(chainid)
        try {
          if (!(chainid in chains)) throw new Error(`Chain ID "${chainid}" is not supported!`)
          await ethprovider.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: chainid }]
          })
        } catch (switchError) {
          if (switchError.code === 4902) {
            await ethprovider.request({
              method: 'wallet_addEthereumChain',
              params: [chains[chainid]]
            })
          }
          else throw switchError
        }
      }
    )
  }), [__actionize, chains, ethprovider, web3React, window.ethereum])

  useEffect(() => {
    if (!isAuthorized) return setReady(false)
    if (!web3React.isActive) return setReady(false)

    if (toHex(web3React.chainId) in chains) {
      action.current = null
      setReady(true)
    } else {
      setReady(false)
      if (autoSelectChain) {
        actions.current.setChain(toHex(NETWORK))
      }
    }
  }, [web3React.chainId, isAuthorized])

  useEffect(() => {
    WEB3_PROVIDER = web3React.provider || DEFAULT_WEB3_PROVIDER
  }, [web3React.provider])

  useEffect(() => {
    if (web3React.account && web3React.provider) {
      SIGNER = web3React.provider.getSigner()
      if (isFunction(authSigner)) authSigner(SIGNER)
    }
  }, [web3React.account, web3React.provider])

  return {
    action: action.current,
    actions: actions.current,
    ready,

    connectors: Connectors.map(([conn, hooks]) => getConnName(conn)),
    chain: web3React.chainId && chains[toHex(web3React.chainId)],

    account: web3React.account,
    web3React,
  }

}
