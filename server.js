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

//for camera test
var handlers = require('./js/camera/handlers'),
    router = require('./router'),
    handle = { };

//handle ======================
handle["/"] = handlers.home;
handle["/home"] = handlers.home;
handle["/upload"] = handlers.upload;
handle._static = handlers.serveStatic;

server.start(router.route, handle);
// configuration ===============================================================

mongoose.connect(database.url);

app.use(express.static(__dirname + '/public'));
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({'extended':'true'}));
app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));
app.use(methodOverride());

// routes ======================================================================
require('./app/routes.js')(app);

// listen (start app with node server.js) ======================================
app.listen(8080);
console.log("App listing on port 8080");

