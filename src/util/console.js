var SimpleConsole = require('simple-console');
module.exports = new SimpleConsole({
  noop: process.env.NODE_ENV === "production"
});