import factory from 'debug'

export default class Logger {

    static ns = 'pm:'
    static #debuginfo = factory(Logger.ns + 'info')
    static #debugwarn = factory(Logger.ns + 'warn')
    static #debugerror = factory(Logger.ns + 'error')

    static info(...args) {
        Logger.#debuginfo(...args)
    }

    static error(...args) {
        Logger.#debugerror(...args)
        console.error(...args) // eslint-disable-line
    }

    static warn(...args) {
        Logger.#debugwarn(...args)
    }

    static setNS(ns) {
        Logger.#debuginfo = factory(ns + 'info')
        Logger.#debugwarn = factory(ns + 'warn')
        Logger.#debugerror = factory(ns + 'error')
    }

}
