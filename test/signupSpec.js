
const Browser = require('zombie');
var app = require('../app.js')
var expect = require('chai').expect
var assert = require('assert');
Browser.localhost('localhost', 4001);

describe('User visits signup page', function() {
  const browser = new Browser();
  beforeEach(function(done) {
    browser.visit('/', done);
  });

  describe('submits form', function(){
    it('should have a signup page', function(){
      browser.assert.text('h1','RocksBnB - feel at home, anywhere');
    });
    it('should submit signup form', function(done){
      browser
      .fill('name', 'testUser')
      .fill('email', 'test23@test.com')
      .fill('password', 'tron21')
      .fill('passwordConfirmation', 'tron21')
      .pressButton('Submit').then(function() {
        assert.ok(browser.success);
        browser.assert.text('h2', 'Welcome back to RocksBnB')
      }).then(done, done);
    });

    it('needs correct passwords', function(done){
      browser
      .fill('name', 'testUser')
      .fill('email', 'test2@test.com')
      .fill('password', 'tron21')
      .fill('passwordConfirmation', 'tron23')
      .pressButton('Submit').then(function() {
        assert.ok(browser.success);
        browser.assert.text('p', 'Sign up to RocksBnBYour passwords did not match, please try again')
      }).then(done, done);
    });
  });

  describe('Logout', function(){
    it('logs out the user and returns to the home page', function(done){
      browser
      .fill('name', 'testUser')
      .fill('email', 'test3@test.com')
      .fill('password', 'tron21')
      .fill('passwordConfirmation', 'tron21')
      .pressButton('Submit').then(function() {
        assert.ok(browser.success);
        browser.pressButton('Sign out').then(function() {
          assert.ok(browser.success);
          browser.assert.text('p', 'Login to RocksBnB')
        }).then(done, done);
      });
    });
  });
});
