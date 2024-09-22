import { get, keys, isArray, isEqual, isEmpty, isFunction, isPlainObject, reduce, castArray, values } from 'lodash'

import logger from '@libs/logger'

export const ActionScheduler = {

  init: function(config) {
    if (!isPlainObject(config)) {
      logger.warn('Empty config provided nothing will be scheduled')
      return
    }

    for (const key in config) {
      const sch = new Scheduler(config[key])
      sch.start()

      this[key] = sch
    }

  },

}

class Scheduler {

  #collectors = {}
  #tick = 0

  #store
  #mergers
  #tickperiod
  #dispatchAction
  #tickerid

  constructor({ store, mergers, dispatch, period = 1000 }) {
    if (isEmpty(store)) {
      throw new Error('Scheduler missing requiered parameter "store"')
    }
    this.#store = store
    this.#mergers = mergers
    this.#tickperiod = period

    this.#dispatchAction = (name, args) => this.#store.dispatch(name, args)
    if (isFunction(dispatch)) this.#dispatchAction = dispatch
  }

  addCollector(collector) {
    this.#collectors[collector] = collector
  }

  removeCollector(collector) {
    delete this.#collectors[collector]
  }

  collectors() {
    return values(this.#collectors)
  }

  start() {

    this.#tickerid = setInterval(() => {
      this.#tick && this.dispatchScheduled()
      this.#tick = (this.#tick + 1) % Number.MAX_SAFE_INTEGER
    }, this.#tickperiod)

    logger.info('Start ActionScheduler TickerID:%s', this.#tickerid)
  }

  stop() {

    if (this.#tickerid) {
      clearInterval(this.#tickerid)
      logger.info('Stop ActionScheduler TickerID:%s', this.#tickerid)
    }

  }

  #collectActions(tick, collectors) {
    return reduce(collectors, (actions, collect) => {
      if (!isFunction(collect)) return actions
      collect(
        (name, args, metadata) => {
          const schedule = get(metadata, 'schedule')
          if (!schedule) {
            logger.info('No schedule provided, action %s dispached on each tick', name)
          }
          if (!schedule || tick % schedule === 0) {
            if (isEmpty(actions[name])) actions[name] = []

            actions[name].push(args)
          }
        },
        this.#store.getState()
      )
      return actions
    }, {})
  }

  #reduceActions(actions) {
    actions = { ...actions }

    const names = keys(actions)

    for (const name of names) {

      const merger = get(this.#mergers, [name])
      if (!merger) continue

      const mergedActions = merger(actions[name])
      if (
        isEqual(mergedActions[name], actions[name]) &&
        isEqual(keys(mergedActions), [name])
      ) continue

      delete actions[name]

      for (const mergedActionsName in mergedActions) {
        const mergedAction = mergedActions[mergedActionsName]

        if (isEmpty(actions[mergedActionsName])) actions[mergedActionsName] = []
        actions[mergedActionsName].push(...mergedAction)

        // push to merge again if new merge candidate was added
        if (actions[mergedActionsName].length > 1) {
          names.push(mergedActionsName)
        }
      }
    }

    return actions
  }

  dispatchNow(collectors) {
    const tick = 0
    this.#dispatch(tick, castArray(collectors || this.collectors()))
  }

  dispatchScheduled(collectors) {
    this.#dispatch(this.#tick, castArray(collectors || this.collectors()))
  }

  #dispatch(tick, collectors) {
    if (!isArray(collectors) || isEmpty(collectors)) return

    const rawActions = this.#collectActions(tick, collectors)
    const actions = this.#reduceActions(rawActions)

    for (const name in actions) {
      for (const args of actions[name]) {
          this.#dispatchAction(name, args)
      }
    }

  }

}
