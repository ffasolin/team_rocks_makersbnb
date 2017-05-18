var express = require('express');
var app = express();
var UserModel = require('./src/User');
var bodyParser = require('body-parser');
var session = require('express-session');
var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var sess;

app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());
app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true,
}));

app.set('view engine', 'ejs');

app.get('/', function (req, res) {
  res.render('pages/signup');
});

app.post('/signup', function(req, res) {
  sess = req.session
  sess.name = req.body.name;
  var user = new UserModel();
  user.name = req.body.name
  user.email = req.body.email
  user.password = bcrypt.hashSync(req.body.password, 10);
  user.save();
  sess.userId = user._id
  res.redirect('/home')
});

app.get('/login', function(req, res) {
  res.render('pages/login')
})

app.post('/login', function(req, res) {
  sess = req.session
  var email = req.body.email
  var password = req.body.password
  UserModel.find({email: email}, function(err, users) {
    if (bcrypt.compareSync(password, users[0].password)) {
      sess.userId = users[0]._id
      res.redirect('/home')
    }else{
      // some message about incorrect password
      res.redirect('/login')
    }
  });
});

app.get('/home', function(req, res) {
  sess = req.session
  res.render('pages/home', {
    name: sess.name
  });
});

app.use(express.static(__dirname + '/views/pages'));

var port = process.env.PORT || 3000
app.listen(port, function () {
console.log('running on port ' + port)
console.log(process.env.NODE_ENV)
});
