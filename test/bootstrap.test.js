const sails = require('sails');
require('babel-register')();
require('babel-polyfill'); // Not required for Node, but the test runner might be something else some time

const LocalStorage = require('node-localstorage').LocalStorage;

/**
 * print the stack of the error, rather than node just warning you and providing only the error message
 */
process.on('unhandledRejection', (reason, p) => {
  console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
});

const { JSDOM } = require('jsdom');
const jsdom = new JSDOM('<!doctype html><html><body></body></html>');
const { window } = jsdom;

function copyProps(src, target) {
  const props = Object.getOwnPropertyNames(src)
    .filter(prop => typeof target[prop] === 'undefined')
    .map(prop => Object.getOwnPropertyDescriptor(src, prop));
  Object.defineProperties(target, props);
}

global.window = window;
global.document = window.document;
global.navigator = {
  userAgent: 'node.js'
};
copyProps(window, global);

global.FormData = document.defaultView.FormData;
global.localStorage = new LocalStorage('./.localStorage/');
global.window.localStorage = global.localStorage;

before(function(done) {

  // Increase the Mocha timeout so that Sails has enough time to lift.
  this.timeout(5000);

  sails.lift({
    log: {
      level: 'error'
    },
    models: {
      connection: 'testMysqlServer',
      migrate: 'drop'
    },
    environment: 'test',
  }, function(err) {
    if (err) return done(err);
    var Barrels = require('barrels');
    var barrels = new Barrels();
    global.fixtures = barrels.data;
    barrels.populate(function(err) {
      done(err, sails);
    });
  });
});

after(function(done) {
  // here you can clear fixtures, etc.
  sails.lower(done);
});