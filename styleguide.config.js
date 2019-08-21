var path = require('path');

module.exports = {
    skipComponentsWithoutExample: true,
    require: [
      path.resolve(__dirname, 'styleguide/setup.js')
    ]
  }