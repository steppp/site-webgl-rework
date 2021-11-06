
import loggingConfiguration from './loggingConfiguration'

let configuration = loggingConfiguration

const log = (severity, msg, ...params) => {
    if (!configuration.enabled) {
        return
    }

    switch (severity) {
        case 'debug':
        case 'info':
        case 'warn':
        case 'error':
            console[severity].call(null, msg, ...params)
            break;
    
        default:
            console.log(msg, params)
            break;
    }
}

const updateConfig = config => {
    configuration = {
        ...configuration,
        ...config
    }
}

const loggingManager = (() => {
    return {
        updateConfig,
        log
    }
})()

export default loggingManager