
require('./data/db').connect();

var express = require('express')
  , routes = require('./routes')
  , auth = require('./lib/auth')
  , http = require('http')
  , path = require('path')
  , passport = require('passport');

var app = express();
app.set('port', process.env.PORT || 5000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

auth.initialize(app);

var middleware = [express.favicon(),
                  express.logger('dev'),
                  express.bodyParser(),
                  express.methodOverride(),
                  express.cookieParser('TOP$Secret'),
                  express.session({Secret: 'Some Secret'}),
                  passport.initialize(),
                  passport.session(),
                  app.router,
                  express.static(path.join(__dirname, 'public'))];
if (app.get('env') == 'development') {
    middleware.push(express.errorHandler());
}
for (var i = 0; i < middleware.length; i++) app.use(middleware[i]);

routes.create(app);

http.createServer(app).listen(app.get('port'), function() {
    console.log('Express server listening on port ' + app.get('port'));
});