
require('./data/db').connect();

var express = require('express')
  , routes = require('routes')
  , http = require('http')
  , path = require('path');

var app = express();
app.set('port', process.env.PORT || 5000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

var middleware = [express.favicon,
                  express.logger('dev'),
                  express.bodyParser(),
                  express.methodOverride(),
                  express.cookieParser('TOP$ECRET'),
                  express.session(),
                  app.router,
                  express.static(path.join(__dirname, 'public'))];
if (app.get('env') == 'development') {
    middleware.push(express.errorHandler());
}
for (var ware in middleware) app.use(ware);

routes.create(app);
http.createServer(app).listen(app.get('port'), function() {
    console.log('Express server listening on port ' + app.get('port'));
});
