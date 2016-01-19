var express  	 = require('express'),
	app 	 	 = express(),
	server	 	 = require('http').createServer(app),
	mongoose 	 = require('mongoose');

/* Database configuration */
require('./models/Users')(mongoose);
require('./models/Organisations')(mongoose);
mongoose.connect('mongodb://localhost/slackCoin');

/* Routes */
require('./routes/coins')(app, mongoose);

server.listen(80);