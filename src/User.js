var mongoose = require('mongoose');
var Schema = mongoose.Schema;
// var bcrypt = require('bcryptjs');
mongoose.connect('mongodb://localhost/makersBnB')

var userSchema = new Schema({
  name: String,
  email: String,
  password: String
});

var UserModel = mongoose.model('UserModel', userSchema);

module.exports = UserModel;
