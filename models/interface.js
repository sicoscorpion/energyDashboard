var Mongoose = require('mongoose')
   , Schema = Mongoose.Schema;

var interfaceModel = Mongoose.model("interface", new Schema({
    ghg         : String,
    homeText    : String,
}, {collection  : "Interface"}));

exports.interfaceModel = interfaceModel;