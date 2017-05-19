var express = require('express');
var app = express();
var UserModel = require('./src/User');
var SpaceModel = require("./src/Space");
var bodyParser = require('body-parser');
var session = require('express-session');
var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var flash = require('connect-flash');
var GetSpace = require('./src/getsSpaces')
var GetUser = require('./src/getUserData')
var sess;

app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());
app.use(flash());
app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true,
}));

app.set('view engine', 'ejs');

app.get('/', function (req, res) {
  res.render('pages/signup', {
    space: GetSpace(),
    message: req.flash('wrongPassword').join()
  });
});

app.post('/signup', function(req, res) {
  if (req.body.password !== req.body.passwordConfirmation) {
    req.flash('wrongPassword', "Your passwords did not match, please try again");
    res.redirect('/')
  }else{
  sess = req.session
  sess.name = req.body.name;
  var user = new UserModel();
  user.name = req.body.name
  user.email = req.body.email
  user.password = bcrypt.hashSync(req.body.password, 10);
  user.save();
  sess.userId = user._id
  //sess.id = GetUser(req.body.email);
  res.redirect('/home')
}
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

app.post('/newspace', function(req, res) {
  sess = req.session
  res.render("pages/newspace")
})

app.get('/databaseQuery', function(req, res){
  SpaceModel.find({}, function(err, spaces){
    res.json(spaces)
  });
});

app.post('/newspace/save', function(req, res){
  sess = req.session
  var newSpace = new SpaceModel();
  newSpace.name = req.body.spacename
  newSpace.description = req.body.description
  newSpace.price = req.body.price
  newSpace.addAvailableDates(req.body.startdate, req.body.enddate)
  newSpace.ownerId = sess.userId
  newSpace.save();
  res.redirect('/home')
})

app.post('/requests', function(req, res) {
  res.render('pages/requests')
})

app.post('/signout', function(req, res) {
  req.session = undefined
  res.redirect('/login')
})

app.use(express.static(__dirname + '/views/pages'));

var port = process.env.PORT || 4001
app.listen(port, function () {
console.log('running on port ' + port)
console.log(process.env.NODE_ENV)
});
