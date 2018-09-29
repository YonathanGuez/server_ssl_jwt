var express     = require('express');
var User   = require('../models/user'); // get our mongoose model
var jwt    = require('jsonwebtoken'); // used to create, sign, and verify tokens
//var bcrypt = require('bcrypt');
// get an instance of the router for api routes
var apiRoutes = express.Router(); 

apiRoutes.post('/signup', function(req, res) {
  console.log(req.body);
  const user = new User({
    name: req.body.name, 
    password: req.body.password,
    admin: true 
  });
  user.save().then(function(result) {
      console.log(result);
      const payload = {admin: user.admin};
      var token = jwt.sign(payload, 'superSecret', { expiresIn : 60*60*24});
      res.status(200).json({
        success: 'New user has been created',
        message: 'Enjoy your token!',
        token: token
      });
  }).catch(error => {
      res.status(500).json({
        error: err
      });
  });
});

// route to authenticate a user (POST http://localhost:8080/api/signin)
apiRoutes.post('/signin', function(req, res) {
    // find the user
  User.findOne({name: req.body.name}, function(err, user) {
      if (err) throw err;
      if (!user) {
        res.json({ success: false, message: 'Authentication failed. User not found.' });
      }
      else if (user) {
        // check if password matches
        if (user.password != req.body.password) {
          res.json({ success: false, message: 'Authentication failed. Wrong password.' });
        }
        else {
          // if user is found and password is right
          // create a token with only our given payload
          // we don't want to pass in the entire user since that has the password
        const payload = {admin: user.admin};
        var token = jwt.sign(payload, 'superSecret', { expiresIn : 60*60*24});
  
          // return the information including token as JSON
        res.json({
            success: true,
            message: 'Enjoy your token!',
            token: token
        });
      }   
    }
  });
});
// TODO: route middleware to verify a token
apiRoutes.use(function(req, res, next) {
  // check header or url parameters or post parameters for token
  var token = req.body.token || req.query.token || req.headers['x-access-token'];
  // decode token
  if (token) {
    // verifies secret and checks exp
    jwt.verify(token,'superSecret', function(err, decoded) {      
      if (err) {
        return res.json({ success: false, message: 'Failed to authenticate token.' });    
      }
      else {
        // if everything is good, save to request for use in other routes
        req.decoded = decoded;    
        next();
      }
    });
  }
  else {
    // if there is no token
    // return an error
    return res.status(403).send({ 
        success: false, 
        message: 'No token provided.' 
    });
  }
});

// route to show a random message (GET http://localhost:8080/api/)
apiRoutes.get('/', function(req, res) {
  res.json({ message: 'Welcome to the API !' });
});
// route to return all users (GET http://localhost:8080/api/users)
apiRoutes.get('/users', function(req, res) {
  User.find({}, function(err, users) {
    res.json(users);
  });
});   

module.exports = apiRoutes;