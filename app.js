// twitter auth example
// 
// dependencies : 
//   express
//   passport
//   passport-twitter

const cf = require('./config.json');

/* config.json examples:

{
  "PORTNUMBER":"3333",
  "TWITTER_CONSUMER_KEY":"your-twitterapp-consumer-key",
  "TWITTER_CONSUMER_SECRET": "your-twitterapp-consumer-secret",
  "APP_DOMAIN":"https://example.com",
  "TWITTER_CALLBACK_PATH":"/_oauth/twitter" 
}

*/

const pp = require('passport');
const express = require('express');
const session = require('express-session');
const strategy = require('passport-twitter').Strategy;

const PORTNUMBER = cf.PORTNUMBER;
const TWITTER_CONSUMER_KEY = cf.TWITTER_CONSUMER_KEY;
const TWITTER_CONSUMER_SECRET = cf.TWITTER_CONSUMER_SECRET;
const TWITTER_CALLBACK_URL = cf.APP_DOMAIN + cf.TWITTER_CALLBACK_PATH;

const CALLBACK_PATH = cf.TWITTER_CALLBACK_PATH
const TOPPAGE_PATH = '/';
const LOGIN_PATH = '/login';
const LOGOUT_PATH = '/logout';

let users = new Map();

pp.serializeUser((user, done)=>{
  done(null, user.id);
});

pp.deserializeUser((obj, done)=>{
  done(null, obj);
});

const ppParamObj = {
  consumerKey: TWITTER_CONSUMER_KEY,
  consumerSecret: TWITTER_CONSUMER_SECRET,
  callbackURL: TWITTER_CALLBACK_URL
};

pp.use(new strategy(ppParamObj,(token, tokenSecret, profile, done) =>{
  let userdata = {
    id: profile.id,
    username: profile.username,
    displayName: profile.displayName,
    photo: profile.photos[0].value
  };
  users.set(profile.id,userdata);
  return done(null, profile);
}));

const app = express();
app.use(session({secret:'SECRET',resave:false,saveUninitialized:false}));
app.use(pp.initialize()); 
app.use(pp.session());

app.get('/', async (req, res)=>{
  let param = {data:{id:null}};
  if("passport" in req.session){
    let userdata = users.get(req.session.passport.user);
    if(userdata != null){
      param.data = userdata;
    }
  }
  res.render("./top.ejs", param);
});

app.get(LOGIN_PATH, pp.authenticate('twitter'));

app.get(LOGOUT_PATH, (req, res) => {
  req.session.passport.user = null;
  res.redirect('/');
});

app.get(CALLBACK_PATH,pp.authenticate('twitter', {successRedirect:'/',failureRedirect:'/'}));

app.listen(PORTNUMBER, function() {
  console.log('API server listening on port '+PORTNUMBER);
});


