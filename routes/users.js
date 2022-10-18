var express = require('express');
const bodyParser = require('body-parser');
var User = require('../models/user');
var router = express.Router();

router.use(bodyParser.json());

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.end('send some content with resources');
  /*
  User.find({})
  .then((users)=>{
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(users);
  })
  .catch((err)=> next(err));
  */
});

router.post('/signup', (req,res,next)=>{
  User.findOne({username: req.body.username})
  .then((user)=>{
     if(user != null) {
        var err = new Error('User ' + req.body.username + ' already exists');
        err.status = 403;
        next(err);
     } else {
      return User.create({
        username: req.body.username,
        password: req.body.password
      })
     }
  })
  .then((user)=>{
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json({status: 'Registration Successful', user: user});
  }, (err)=> next(err))
  .catch((err)=> next(err));
});

router.post('/login',(req,res,next)=>{ 

  if(!req.session.user){
    var authHeader = req.headers.authorization;

    if (!authHeader) {
        var err = new Error('You are not authenticated!');
        res.setHeader('WWW-Authenticate', 'Basic');
        err.status = 401;
        return next(err);  ///this will take to the error handler where the error handler construct 
                        // cosntruct the replay and send back to the client
        
    }

    var auth = new Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');
    var username = auth[0];
    var password = auth[1];
    
    User.findOne({username: username})
    .then((user)=>{
      if(user === null){
        var err = new Error('User ' + username + ' does not exit');
        res.setHeader('WWW-Authenticate', 'Basic');      
        err.status = 403;
        return next(err);
      } else if(user.password !== password){
        var err = new Error('Your password is incorrect');
        res.setHeader('WWW-Authenticate', 'Basic');      
        err.status = 401;
        return next(err);
      }
      else if (username == username && password == password) { 
        //let setup the session here
        req.session.user = 'authenticated';
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        res.end('You are authenticated!');
      } 
    })
    .catch((err)=>next(err));

  } else {
      res.statusCode =200;
      res.setHeader('Content-Type', 'text/plain');
      res.end('You are already authenticated!');
  }
});

router.get('/logout',(req,res)=>{
   if(req.session){
      req.session.destroy();  //remove the session from the server side
      res.clearCookie('session-id'); // asking the client to delete cookie
      res.redirect('/');
   } else{
       var err = new Error('Your are not logged in!');
       err.status = 403;
      next(err);
   }
});

module.exports = router;
