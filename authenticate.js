var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('./models/user');
var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
var jwt = require('jsonwebtoken');

var config = require('./config');

//possport local strategy is based on username and password.
exports.local = passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

exports.getToken = function(user) {
    //inside jwt.sign(pay_load)
    return jwt.sign(user, config.secretKey, {expiresIn: 3600}); // to create jwt usig jwt 
                                                                //we imported
};

var opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();  //from where to extrac jwt
opts.secretOrKey = config.secretKey;


//configering JWT based strategy
//extract the payload based on opt
exports.jwtPassport = passport.use(new JwtStrategy(opts, 
    (jwt_payload, done) => {
        console.log("JWT payload: ", jwt_payload);
        User.findOne({_id: jwt_payload._id}, (err, user)=>{
            if (err) {
                return done(err, false); // passport will pass to ur strategy.
            }
            else if(user) {
                return done(null, user); 
            }
            else {
                return done(null, false);
            }      
        });
}));
//this one use token come form the req and authenticate --based on the strategy.
exports.verifyUser = passport.authenticate('jwt', {session: false});
