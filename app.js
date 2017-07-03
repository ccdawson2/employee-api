'use strict';

var SwaggerExpress = require('swagger-express-mw');
var app = require('express')();
module.exports = app; // for testing

var cors = require('cors');
app.use(cors());

var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

var config = {
  appRoot: __dirname // required config
};

SwaggerExpress.create(config, function(err, swaggerExpress) {
  if (err) { throw err; }

  // install middleware
  swaggerExpress.register(app);

  var port = process.env.PORT || 10105;
  app.listen(port);

  console.log("CORS-enabled employee mongodb api server listening on port " + port);
  console.log("(http://localhost:" + port + "/swagger displays swagger definition)");
});
