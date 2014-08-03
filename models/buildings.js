var Mongoose = require('mongoose')
   , Schema = Mongoose.Schema;

Mongoose.model("buildings", new Schema({
    name        : String,
    code        : String,
    profile     : String,
    size        : String,
    built       : String,
    renovated   : String,
    feature     : String,
    type		: String,
    available	: String,
    image		: String,  
}, {collection  : "Buildings"}));