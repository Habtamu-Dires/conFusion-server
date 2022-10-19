var express = require('express');
const bodyParser = require('body-parser');
var User = require('../models/user');
var passport = require('passport');
var authenticate = require('../authenticate');

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
//the passport.authenticate('local ) will load up user prop on request message
router.post('/login', passport.authenticate('local'),(req,res)=>{ 
  
  var token = authenticate.getToken({_id: req.user._id}); //creating a a token with a payload of user id only
                                                         // you can add any other informatin

  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.json({success: true, token: token, status: 'You are successfully logged in'}); //send the token
                                                        //then client will include the token
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
/*
router.delete('/del', (req,res,next)=> {
  User.remove({})
  .then((resp)=>{
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json(resp);
  }, (err)=> next(err))
  .catch((err)=>next(err));
});
*/

module.exports = router;
