// =======================
// get the packages we need ============
// =======================
var express     = require('express');
var app         = express();
var bodyParser  = require('body-parser');
var morgan      = require('morgan');
var mongoose = require('mongoose');
var jwt    = require('jsonwebtoken'); // used to create, sign, and verify tokens
var config = require('./config'); // get our config file
var User   = require('./app/models/user'); // get our mongoose model
var apiRoutes=require('./app/router/routes');

// =======================
// configuration =========
// =======================
var port = process.env.PORT || 8080; // used to create, sign, and verify tokens
mongoose.connect(config.database,{useNewUrlParser: true }); // connect to database
app.set('superSecret', config.secret); // secret variable
// use body parser so we can get info from POST and/or URL parameters
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// use morgan to log requests to the console
app.use(morgan('dev'));

// =======================
// ROUTER ================
// =======================
app.get('/', function(req, res) {
    res.send('Hello! The API is at http://localhost:' + port + '/api');
});

// API ROUTES -------------------
//TEST MONGOOSE
app.get('/setup', function(req, res) {
   // create a sample user
   var nick = new User({ 
      name: 'Nick', 
      password: 'passwordddd',
      admin: true 
    });
    // save the sample user
    nick.save(function(err) {
      if (err) throw err;
      console.log('User saved successfully');
       res.json({ success: true });
    });
  });

// apply the routes to our application with the prefix /api
app.use('/api', apiRoutes);
app.listen(port);
console.log('Magic happens at http://localhost:' + port);