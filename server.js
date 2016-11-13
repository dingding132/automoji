/**
 * Created by JohnWu on 2016-11-11.
 */
// set up ======================================================================
var express = require('express');
var app = express();
var mongoose = require('mongoose');
var port  	 = process.env.PORT || 8080;
var database = require('./config/database');

var morgan = require('morgan');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');

////for camera test
var handlers = require('./config/handlers'),
    router = require('./config/router'),
    handle = { },
    config = require('./config/config'),
    http = require('http'),
    url = require('url');

//handle ======================
handle['/'] = handlers.home;
handle['/home'] = handlers.home;
handle['/upload'] = handlers.upload;
handle._static = handlers.serveStatic;

// configuration ===============================================================

mongoose.connect(database.url);

app.use(express.static(__dirname + '/public'));
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({'extended':'true'}));
app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));
app.use(methodOverride());

app.get('/api/download', function(req, res){
    var file = __dirname + '/public/media/test.flv';
    res.download(file); // Set disposition and send it.
});

// routes ======================================================================
require('./app/routes.js')(app);

////for camera test
function onRequest(request, response) {

    var pathname = url.parse(request.url).pathname,
        postData = '';
    if (pathname != '/api/kairos' || pathname != '/api/messages') {
        request.setEncoding('utf8');

        request.addListener('data', function(postDataChunk) {
            postData += postDataChunk;
        });

        request.addListener('end', function() {
            router.route(handle, pathname, response, postData);
        });
    }
}

http.createServer(app,onRequest).listen(config.port);



// listen (start app with node server.js) ======================================
//app.createServer(onRequest).listen(8080);
console.log("App listing on port 8080");

