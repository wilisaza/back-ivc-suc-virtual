import pino from 'pino'

const logger = pino({
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: 'yyyy-mm-dd HH:MM:ss',
      messageFormat: '{msg} | reqId={requestId}',
      ignore: 'requestId',
    },
  },
})

export default logger
