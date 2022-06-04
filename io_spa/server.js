const
  express = require('express'),
  serveStatic = require('serve-static'),
  history = require('connect-history-api-fallback'),
  port = 8050

const app = express()

app.use(history())

app.use(serveStatic(__dirname + '/dist/spa'))
console.log(__dirname)
app.listen(port)
