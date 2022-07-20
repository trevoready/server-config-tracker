var express = require('express');
var router = express.Router();
var uid = require('uid-safe');
var bcrypt = require('bcrypt');
var moment = require('moment');
var mysql = require('../includes/mysql-connect');


router.get('/', function(req, res, next) {
  res.redirect('/users/login');
});

//Login
router.get('/login', function(req, res, next) {
  res.render('login');
});
router.post('/login', async function(req, res, next) {
  var username = req.body.username;
  var password = req.body.password;
  var user = await mysql.query('SELECT * FROM users WHERE username = ?', [username]);
  if (user.length == 0) {
    res.render('login', {error: 'Username not found'});
  } else {
    //Check if password is empty in database
    if (user[0].password == '') {
      //create hashed password
      var salt = await bcrypt.genSalt(10);
      var hash = await bcrypt.hash(password, salt);
      //set passowrd to submitted password
      await mysql.query('UPDATE users SET password = ? WHERE username = ?', [hash, username]);
      //redirect back to login
      res.redirect('/users/login');
    } else {
      //check if password is correct
      var isValid = await bcrypt.compare(password, user[0].password);
      if (isValid) {
        //set session
        req.session.user = user[0];
        //redirect to dashboard
        res.redirect('/users/dashboard');
      } else {
        res.render('login', {error: 'Password is incorrect'});
      }
    }
  }
});


module.exports = router;
