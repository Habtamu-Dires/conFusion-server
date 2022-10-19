var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('./models/user');

//possport local strategy is based on username and password.
exports.local = passport.use(new LocalStrategy(User.authenticate()));
//support for session in passport 
passport.serializeUser(User.serializeUser());   //to save to session
passport.deserializeUser(User.deserializeUser()); //to extract from the session