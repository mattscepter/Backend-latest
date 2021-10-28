const chalk = require('chalk')

const log4js = require('log4js')
const logger = log4js.getLogger()
logger.level = 'debug'

const loggerUtil = (message, logType = 'INFO') => {
    logType === 'INFO'
        ? logger.info(chalk.blueBright(message))
        : logType === 'ERROR'
        ? logger.error(chalk.redBright(message))
        : logType === 'SERVER'
        ? logger.info(chalk.greenBright(message))
        : null
}

module.exports = {
    loggerUtil
}
