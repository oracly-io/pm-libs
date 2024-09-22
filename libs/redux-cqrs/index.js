import logger from '@lib/logger'
import {
  isPlainObject,
  isFunction,
  isEmpty,
  isError,
  isNull,
  filter,
  keyBy,
  get,
} from 'lodash'

import { success, rejected, fails } from './convention'
import { QUERY, COMMAND } from './dispatchType'
import { THROTTLED, SUCCEED, FAILED } from './actionStatus'

let _inprogress = {}

function actionize(dispatchs) {
  dispatchs = filter(dispatchs, isFunction)
  dispatchs = filter(dispatchs, 'actionType')
  return keyBy(dispatchs, 'actionType')
}

function printError(msg) {
  logger.info(msg)
  console.error(msg) // eslint-disable-line
}

function serializer(key, value) {
  if (typeof value === 'bigint') value = String(value)
  if (typeof value === 'undefined') value = String(null)
  return value
}

export function cqrsMiddleware(asynchronous) {
  return store => next => action => {
    const { dispatchType } = action.metadata
    const type = action.type

    if (!dispatchType) {
      printError(`${type} get ignore`)
      return next(action)
    }

    const _actionstr = JSON.stringify({ type, args: action.args }, serializer)
    const _action = JSON.parse(_actionstr)
    const method = asynchronous[type]

    if (typeof method !== 'function') return next(action)

    if (_actionstr in _inprogress) {
      return store.dispatch({
        ..._action,
        type: rejected(type),
        metadata: {
          dispatchType,
          status: THROTTLED,
          origin: action,
        }
      })
    }

    if (dispatchType === QUERY) {
      _inprogress[_actionstr] = null
    }

    const promise = method(action.args)
    next(action)
    return promise
      .then(result => {
        delete _inprogress[_actionstr]
        _action.args.result = JSON.parse(JSON.stringify(result, serializer))
        return store.dispatch({
          ..._action,
          type: success(type),
          metadata: {
            dispatchType,
            status: SUCCEED,
            origin: action,
          }
        })
      })
      .catch(error => {
        delete _inprogress[_actionstr]
        if (isError(error)) {
          printError(error)
          error = error.toString()
        }
        _action.args.error = error
        return store.dispatch({
          ..._action,
          type: fails(type),
          metadata: {
            dispatchType,
            status: FAILED,
            origin: action,
          }
        })
      })
  }
}

let METADATA = null
export function initMetadata(metadata) {
  if (isEmpty(metadata) || !isPlainObject(metadata)) return
  if (!isNull(METADATA)) return

  METADATA = structuredClone(metadata)
}

function _creator(actionName, args, metadata, dispatchType) {
  if (!isEmpty(args) && !isPlainObject(args)) args = {}
  if (!isEmpty(metadata) && !isPlainObject(metadata)) metadata = {}

  args = args || {}
  metadata = metadata || {}

  return {
    type: actionName,
    args,
    metadata: {
      ...METADATA,
      ...metadata,
      dispatchType
    }
  }
}

export function command(actionName, args, metadata) {
  return _creator(actionName, args, metadata, COMMAND)
}

export function query(actionName, args, metadata) {
  return _creator(actionName, args, metadata, QUERY)
}

export function cqrsDispatchMapper(dispatchMapper) {
  if (!isFunction(dispatchMapper)) return dispatchMapper

  return (dispatch, ownProps) => {
    const actions = dispatchMapper(
      {
        command: (actionName) => {
          const result = (args) => dispatch(command(actionName, args))
          result.actionType = actionName
          return result
        },
        query: (actionName) => {
          const result = (args) => dispatch(query(actionName, args))
          result.actionType = actionName
          return result
        }
      },
      ownProps
    )
    const dispatches = actionize(actions)
    dispatches['dispatch'] = dispatch
    return dispatches
  }
}

export function connectDecorator(reduxConnect, stateMapper, dispatchMapper, merge, options) {
  if (!isFunction(reduxConnect)) {
    return printError('Missing reduxConnect function!')
  }

  const start = Date.now()
  const connector = reduxConnect(stateMapper, cqrsDispatchMapper(dispatchMapper), merge, options)
  const connecttook = Date.now() - start
  if (connecttook > 10) {
    logger.warn('[Violation] Connect took ' + connecttook + 'ms')
  }
  return connector
}

export function findAction (action, type) {

  while (action && action.type !== type) {
    action = get(action, ['metadata', 'origin'])
  }

  return action
}

export { success, rejected, fails, QUERY, COMMAND, THROTTLED, SUCCEED, FAILED }


