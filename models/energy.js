var Mongoose = require('mongoose')
   , Schema = Mongoose.Schema;

Mongoose.model("dataHour", new Schema({
    date            :  Date,
    time            :  String, 
    code            :  String,
    status          :  String,
    value           :  Number
}, {collection  : "dataHour"} ));

Mongoose.model("dataDaily", new Schema({
    date            :  Date,
    time            :  String, 
    code            :  String,
    status          :  String,
    value           :  Number
}, {collection  : "dataDaily"} ));

Mongoose.model("dataMonthly", new Schema({
    month           :  String, 
    code            :  String,
    status          :  String,
    value           :  Number
}, {collection  : "dataMonthly"})); 


