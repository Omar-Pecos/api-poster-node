const MongoPaging = require('mongo-cursor-pagination');
const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    user_id : String,
    title : String,
    content : Array,
    url_image : {type : String , default : null},
    url_yt : {type : String , default : null},
    date : {type : Date, default : Date.now},
    theme : String,
    category : String,
    author : String,
    favorites : { type : mongoose.Schema.Types.Mixed, default : {}}
}, {minimize : false});

//plugin for pagination
postSchema.plugin(MongoPaging.mongoosePlugin);

const Post = mongoose.model('Post',postSchema);

module.exports = Post;