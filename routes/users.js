var express = require('express');
const bodyParser = require('body-parser');
var User = require('../models/user');
var passport = require('passport');

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
  User.register(new User({username: req.body.username}), req.body.password, 
  (err, user)=>{

     if(err) {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.json({err: err});
     } else {
        //let authenticate what we already registered
        passport.authenticate('local')(req,res,()=>{
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json({success: true , status: 'Registration Successful'});
        });
      }
  });
});
//the usrname and password are expected from the body of the request.
//the passport.authenticate('locla') will make authentication and handle any error if there
//other wise it will pass to the next callback function as show below
router.post('/login', passport.authenticate('local'),(req,res)=>{ 
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.json({success: true , status: 'You are successfully logged in'});
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
