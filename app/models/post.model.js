const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    user_id : String,
    title : String,
    content : Array,
    url_image : String,
    url_yt : String,
    date : {type : Date, default : Date.now},
    theme : String,
    category : String,
    author : String,
    favorites : { type : mongoose.Schema.Types.Mixed, default : {}}
}, {minimize : false});

const Post = mongoose.model('Post',postSchema);

module.exports = Post;