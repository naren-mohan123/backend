var express = require('express');
const bodyParser = require("body-parser");
var User = require("../models/user");

var router = express.Router();

router.use(bodyParser.json());


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


// For Signing Up
router.post("/signup",(req,res,next)=>{

  User.findOne({username : req.body.username})
  .then((user) => {

    if(user!=null){
      var err = new Error("User" + req.body.username + " already Exists!" );
      err.status = 403;
      next(err);
    }
    else{
      return User.create({
        username : req.body.username,
        password : req.body.password
      });
    }
  })
  .then((user) => {
    res.statusCode = 200;
    res.setHeader("Content-type","application/json");
    res.json({status : "Registartion Successful!", user : user});
  },(err)=>next(err))
  .catch((err) => next(err));
});



//for Login
router.post("/login",(req,res,next)=> {

  if(!req.session.user){
    var authHeader = req.headers.authorization;

    if(!authHeader){
      var err = new Error("You are not Authenticated!");
      err.setHeader("WWW-Authenticate","Basic");
      err.status = 401;
      return next(err);
    }

    var Auth = new Buffer.from(authHeader.split(" ")[1],"base64").toString().split(":");
    var username = Auth[0];
    var password = Auth[1];

    User.findOne({username : username})
    .then((user) => {

      if(user === null){
        var err = new Error('User ' + username + ' does not exist!');
        err.status = 403;
        return next(err);
      }

      else if(user.password !== password){
        var err = new Error('Your password is incorrect!');
        err.status = 403;
        return next(err);
      }

      else if(user.username === username && user.password === password);{
        req.session.user = "authenticated";
        res.statusCode = 200;
        res.setHeader("Content-type","test/plain");
        res.end("you are authenticated!");
      }
    })
    .catch((err) => next(err));
  }

  else {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end('You are already authenticated!');
  }
});



//logout 
router.get("/logout", (req,res,next)=> {

  if(req.session){
    req.session.destroy();
    res.clearCookie("session-id");
    res.redirect("/");
  }

  else {
    var err = new Error('You are not logged in!');
    err.status = 403;
    next(err);
  }

});


module.exports = router;
