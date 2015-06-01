var Mongoose = require('mongoose')
   , Schema = Mongoose.Schema;

var buildingModel = Mongoose.model("buildings", new Schema({
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
    location    : {
        longitude  : String,
        latitude    : String
    }
}, {collection  : "Buildings"}));

exports.buildingModel = buildingModel;