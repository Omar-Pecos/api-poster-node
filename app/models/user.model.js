const MongoPaging = require('mongo-cursor-pagination');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    fullname : String,
    username : String,
    email : String,
    password : String,
    active : Boolean,
    roles: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Role"
      }
    ],
    favorites : [String],
    progress : Array
});

//plugin for pagination
userSchema.plugin(MongoPaging.mongoosePlugin);

const User = mongoose.model('User',userSchema);

module.exports = User;


/*
roles: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Role"
      }
    ]
 */