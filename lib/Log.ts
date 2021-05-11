'use strict'
import config = require('../config')

const LogLevels = {
    DEBUG : 0,
    INFO  : 1,
    WARN  : 2,
    ERROR : 3,
    MONITOR: 3
}

// default to debug if not specified
function logLevelName () {
    return config.logger.LOG_LEVEL || 'DEBUG'
}

function isEnabled (level) {
    return level >= LogLevels[logLevelName()]
}

function appendError (params, err) {
    if (!err) {
        return params
    }

    return Object.assign(
        params || { },
        { errorName: err.name, errorMessage: err.message, stackTrace: err.stack }
    )
}

function logger (levelName, message, params) {
    if (!isEnabled(LogLevels[levelName])) {
        return
    }

    let logMsg = {} as any
    logMsg.level = levelName
    logMsg.message = message
    logMsg = Object.assign(logMsg, params)

    console.log(JSON.stringify(logMsg))
}

export function debug (msg, params) {
    logger('DEBUG', msg, params)
}
export function info (msg, params) {
    logger('INFO', msg, params)
}
export function warn (msg, params, err) {
    logger('WARN', msg, appendError(params, err))
}
export function error (msg, params, err) {
    logger('ERROR', msg, appendError(params, err))
}
export function monitor (epoch: number, startTime: number, tags?: Tags) {
    let concatTag = ''.concat(`duration:${+new Date(epoch) - startTime}`)
    if (tags) {
        const tagString = Object.keys(tags).map((key) => {
            return `${key}:${tags[key]}`
        }).join(',')
        concatTag = concatTag + ',' + tagString
    }

    const msg = `MONITORING|${epoch}|${+new Date(epoch) - startTime}|histogram|webhook_response_time|#${concatTag}`
    logger('MONITOR', msg, {})
}

interface Tags {
    [key: string]: string
}
