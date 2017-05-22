const path = require('path');
const BASE_DIR = path.resolve(__dirname, '../..');
const BUILD_DIR = path.resolve(__dirname, '../../', '.tmp/public/js');
const APP_DIR = path.resolve(__dirname, '../../', 'assets/js');

module.exports = function(grunt) {

  grunt.config.set('webpack', {
    dev: {
      context: BASE_DIR,
      entry: ['babel-polyfill', APP_DIR + '/index.jsx'],
      output: {
        path: BUILD_DIR,
        filename: 'bundle.js'
      },
      module: {
        loaders: [
          {
            test: /\.jsx?/,
            include: APP_DIR,
            loader: 'babel-loader',
            options: {
              presets: ["env", "react"]
            }
          }
        ]
      }
    }
  });

  grunt.loadNpmTasks('grunt-webpack');

};