var express     = require('express');
var User   = require('../models/user'); // get our mongoose model
var jwt    = require('jsonwebtoken'); // used to create, sign, and verify tokens
var bcrypt = require('bcrypt');
var apiRoutes = express.Router(); 
const SALTWORKFACTORY=10;

apiRoutes.post('/signup', function(req, res) {
  console.log(req.body);
  //generate SALT
  bcrypt.genSalt(SALTWORKFACTORY,function(err,salt){
    if(err) return next(err);
    //Hash password
    bcrypt.hash(req.body.password, salt, function(err, hash){
      if(err) {
        return res.status(500).json({error: err});
      }
      else {
        const user = new User({
          name: req.body.name, 
          password: hash,
          admin: true 
        });
        user.save().then(function(result) {
          console.log(result);
          const payload = {admin: user.admin};
          var token = jwt.sign(payload, 'superSecret', { expiresIn : 60*60*24});
          return res.status(200).json({
            success: 'New user has been created',
            message: 'Enjoy your token!',
            token: token
          });
        }).catch(error => {
          return res.status(500).json({
            error: err
          });
        });
      }
    });
  });
  
});

// route to authenticate a user (POST http://localhost:8080/api/signin)
apiRoutes.post('/signin', function(req, res) {
    // find the user
  User.findOne({name: req.body.name}, function(err,user) {
    if (!user) {
      return res.status(401).json({ success: false, message: 'Authentication failed. User not found.' });
    }
    else if (user) {
      bcrypt.compare(req.body.password, user.password, function(err, result){
        if(err) {
          return res.status(401).json({
             failed: 'Unauthorized Access err'
          });
        }
        if(result) {
          const payload = {admin: user.admin};
          var token = jwt.sign(payload, 'superSecret', { expiresIn : 60*60*24});
          // return the information including token as JSON
          return res.status(200).json({
              success: true,
              message: 'Enjoy your token!',
              token: token
          });
        }
        else {
          return res.status(401).json({success: false, message: 'Authentication failed. Wrong password.'});
        }
      });  
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
    return res.status(403).send({success: false, message: 'No token provided.'});
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