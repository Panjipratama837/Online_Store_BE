const dbConfig = require('../config/db.config');

const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const db = {};
db.mongoose = mongoose;
db.url = dbConfig.url;
db.posts = require('./post.model')(mongoose);
db.login = require('./login.model')(mongoose);
db.biodata = require('./biodata.model')(mongoose);
db.product = require('./product.model')(mongoose);
db.category = require('./category.model')(mongoose)

module.exports = db;
