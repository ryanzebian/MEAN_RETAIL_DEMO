var mongoose = require('mongoose');

var userSchema = {
    name:{
        type:String,
        required: true
    }
};

module.exports = new mongoose.Schema(userSchema);
module.exports.userSchema = userSchema;