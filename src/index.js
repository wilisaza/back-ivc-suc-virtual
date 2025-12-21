import express from 'express'
import { corsMiddleware } from './middlewares/cors.js'
import logger from './util/logger.js'

//routes
import reqLoggerIdentMiddleware from './middlewares/req-logger.js'
import loginRoutes from './routes/login/index.js'
import esalRoutes from './routes/esal/index.js'

const app = express()

// Set up request logger middleware
app.use(reqLoggerIdentMiddleware)

// Set up cors
app.use(corsMiddleware)

app.use(
  express.json({
    verify: (req, res, buf) => {
      req.rawBody = buf
    },
  })
)

app.use(
  express.urlencoded({
    extended: false,
    verify: (req, res, buf) => {
      req.rawBody = buf
    },
  })
)
app.use(
  express.raw({
    extended: false,
    verify: (req, res, buf) => {
      req.rawBody = buf
    },
  })
)


// the default route should just be a 404 to minimize attack surface
app.get('/', function (req, res) {
  res.status(404).json({ error: 'Not Authorized' })
})

app.get('/health', function (req, res) {
  res.status(200).json({ message: 'Service is running' })
})  

//Login routes
app.use('/login', loginRoutes)

//ESAL routes
app.use('/esal', esalRoutes)



app.use(function (req, res) {
  res.status(404).json({ error: 'Not Authorized' })
})

app.use(function (err, req, res) {
  console.error(err.stack)
  res.status(500).json({ error: 'Server Error' })
})

const port = parseInt(process.env.PORT ?? 80, 10)
app.listen(port, async () => {
  /**
   * Se inhabilita por implementacion de ORM Sequalize, posteriormente se borrara
   * await initOraclePool()
   */
  logger.info('Listening Port: ' + port)
})

const processTerminate = async (signal) => {
  logger.info(`Received ${signal}. Terminating the process`)
  /**
   * Se inhabilita por implementacion de ORM Sequalize, posteriormente se borrara
   * await closePoolAndExit()
   */
  process.exit(0)
}

// Handle process termination
process.once('SIGTERM', processTerminate).once('SIGINT', processTerminate)
