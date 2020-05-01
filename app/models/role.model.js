const mongoose = require('mongoose');

const rolSchema = new mongoose.Schema({
    name : String,
    type : Number
});

const Role = mongoose.model("Role",rolSchema);

module.exports = Role;