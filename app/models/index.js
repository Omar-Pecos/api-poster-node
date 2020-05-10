/* Initialize Mongoose */
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

mongoose.set('useFindAndModify', false);

const db = {};
db.mongoose = mongoose;

db.user = require('./user.model');
db.role = require('./role.model');
db.post = require('./post.model');
db.category = require('./category.model');

db.ROLES = ['user','admin'];

module.exports = db;