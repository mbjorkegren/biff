var SimpleConsole = require('simple-console');
module.exports = process.env.NODE_ENV === "production" ? new SimpleConsole(null) : new SimpleConsole();