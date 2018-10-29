// =====================================
// get the packages we need ============
// =====================================
var https = require('https');
var fs = require('fs');
var express     = require('express');
var bodyParser  = require('body-parser');
var morgan      = require('morgan');
var mongoose = require('mongoose');
var config = require('./config'); // get our config file
var User   = require('./app/models/user'); // get our mongoose model
var apiRoutes=require('./app/router/routes');

// =======================
// configuration =========
// =======================
var options = {
    key: fs.readFileSync( './security/localhost.key' ),
    cert: fs.readFileSync( './security/localhost.cert' ),
    requestCert: false,
    rejectUnauthorized: false
};
var app = express();
var port = process.env.PORT || 8080; // used to create, sign, and verify tokens
mongoose.connect(config.database,{useNewUrlParser: true }); // connect to database
app.set('superSecret', config.secret);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(morgan('dev'));

// =======================
// ROUTER ================
// =======================
app.get('/', function(req, res) {
    res.send('Hello! The API is at http://localhost:' + port + '/api');
});
// apply the routes to our application with the prefix /api
app.use('/api', apiRoutes);

var server = https.createServer( options, app );

server.listen( port, function () {
    console.log( 'Express server listening on port ' + server.address().port );
} );
