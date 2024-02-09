import { createLogger, format, transports } from 'winston'

const form = format.combine(
  format.simple(),
  format.label({ label: 'leetcode-reminder' }),
  format.timestamp(),
  format.errors({ stack: 'true' }),
  format.printf(({ level, message, label, timestamp }) => {
    return `${timestamp} [${label}] ${level}: ${message}`
  })
)

const logger = createLogger({
  level: 'debug',
  format: form,
  transports: [
    //
    // - Write to all logs with level `info` and below to `out.log`.
    // - Write all logs error (and below) to `error.log`.
    //
    new transports.File({ filename: 'error.log', level: 'error' }),
    new transports.File({ filename: 'out.log' })
  ]
})

//
// Also log to the `console`
// with the colorized simple format.
//
logger.add(new transports.Console({
  format: format.combine(format.colorize(), form)
}))

export { logger }
