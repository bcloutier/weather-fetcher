// set up ======================================================================
var express  = require('express');
var app      = express(); 								// create our app w/ express
var port  	 = process.env.PORT || 8090; 				// set the port
var morgan   = require('morgan');
var bodyParser = require('body-parser');
//var favicon = require('serve-favicon');

// configuration ===============================================================
app.use(express.static(__dirname + '/public')); 		// set the static files location /public for users
app.use(morgan('dev')); // log every request to the console
app.use(bodyParser.json()); // parse application/json
//app.use(favicon(__dirname + '/public/favicon.ico'));

// routes ======================================================================
require('./app/routes.js')(app);

// listen (start app with node server.js) ======================================
app.listen(port);
console.log("App listening on port " + port);
