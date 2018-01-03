let passport=require('passport');
let FacebookStrategy=require('passport-facebook').Strategy;
var express = require('express');
var path=require('path');
var app = express();

passport.use(new FacebookStrategy({
    clientID: "1605745972802061",
    clientSecret: "3bf1c75e9d207eab9585f57ce1a8adf6",
    callbackURL: "http://localhost:3000/auth/facebook/callback"
  },
  function(accessToken, refreshToken, profile, cb) {
      return cb(null,profile);
  }
));

passport.serializeUser(function (user, cb) {
    cb(null, user);
});

passport.deserializeUser(function (obj, cb) {
    cb(null, obj);
});

var session = require('express-session');
app.use(session({ secret: "helloworld" }));
app.use(passport.initialize());
app.use(passport.session());

app.get('/auth/facebook', passport.authenticate('facebook'));

app.get('/auth/facebook/callback',
    passport.authenticate('facebook', { failureRedirect: '/login',successRedirect:'/home',
    failureFlash:"Invalid username or password"})
);

app.get('/',function(req,res){
    res.sendFile(path.join(__dirname,'index.html'));
});

app.get('/error',function(req,res){
    res.sendFile(path.join(__dirname, 'error.html'));
})

app.get('/home',function(req,res){
    if (req.isAuthenticated()){
        console.log("Authenicated")
    res.sendFile(path.join(__dirname, 'home.html'));
    }
})

app.get('/logout', function (req, res) {
    console.log('logging out');
    req.logout();
    res.redirect('/');
});

var server = app.listen(3000, function () {
    console.log('Example app listening at http://%s:%s',
        server.address().address, server.address().port);
});
