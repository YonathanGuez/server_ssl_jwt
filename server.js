// =======================
// get the packages we need ============
// =======================
var express     = require('express');
var app         = express();
var bodyParser  = require('body-parser');
var morgan      = require('morgan');
var mongoose = require('mongoose');
var config = require('./config'); // get our config file
var User   = require('./app/models/user'); // get our mongoose model
var apiRoutes=require('./app/router/routes');

// =======================
// configuration =========
// =======================
var port = process.env.PORT || 8081; // used to create, sign, and verify tokens
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

app.listen(port, function(){
    console.log('Server is running on Port',port);
 });