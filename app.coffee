
require('./data/db').connect()

express = require 'express'
routes = require './routes'
http = require 'http'
path = require 'path'

app = express()
app.set 'port', process.env.PORT || 5000
app.set 'views', __dirname + '/views'
app.set 'view engine', 'jade'

app.use middleware for middleware in [
        express.favicon(),
        express.logger('dev'),
        express.bodyParser(),
        express.methodOverride(),
        express.cookieParser('TOP$ECRET'),
        express.session(),
        app.router,
        express.static(path.join(__dirname, 'public'))]

if app.get('env') is 'development'
    app.use express.errorHandler()

routes.create app

http.createServer(app).listen app.get('port'), () ->
    console.log 'Express server listening on port ' + app.get('port')

