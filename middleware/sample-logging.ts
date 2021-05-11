'use strict'
import * as log from '../lib/Log'
const appConfig = require('../config')

/**
 * Constructs the response object
 *
 * @remarks
 * config should be { sampleRate: double } where sampleRate is between 0.0-1.0
 * This configuration will determine the percentage of production logs, that will be sampled and logged via console.log
 *
 * @returns a response object of type IProcessedRespObj
 *
 */
module.exports = (config: ConfigObject) => {
    let oldLogLevel
    return {
        before: (handler, next) => {
            if (config.sampleRate && Math.random() <= config.sampleRate) {
                oldLogLevel = appConfig.logger.LOG_LEVEL
                appConfig.logger.LOG_LEVEL = 'DEBUG'
            }

            next()
        },
        after: (handler, next) => {
            if (oldLogLevel) {
                appConfig.logger.LOG_LEVEL = oldLogLevel
            }

            next()
        },
        onError: (handler, next) => {
            const awsRequestId = handler.context.awsRequestId
            const invocationEvent = JSON.stringify(handler.event)
            log.error('invocation failed', { awsRequestId, invocationEvent }, handler.error)

            next(handler.error)
        }
    }
}

interface ConfigObject {
    sampleRate: number
}
