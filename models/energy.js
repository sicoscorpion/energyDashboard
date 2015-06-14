var Mongoose = require('mongoose')
   , Schema = Mongoose.Schema;

Mongoose.model("dataHour", new Schema({
    date            :  { type: [Date], index: true },
    time            :  { type: [String], index: true }, 
    code            :  { type: [String], index: true },
    status          :  String,
    value           :  Number
}, {collection  : "dataHour"} ));

Mongoose.model("dataDaily", new Schema({
    date            :  { type: [Date], index: true },
    time            :  { type: [String], index: true }, 
    code            :  { type: [String], index: true },
    status          :  String,
    value           :  Number
}, {collection  : "dataDaily"} ));

Mongoose.model("dataMonthly", new Schema({
    month           :  { type: [String], index: true },
    code            :  { type: [String], index: true }, 
    year            :  { type: [String], index: true },
    status          :  String,
    value           :  Number
}, {collection  : "dataMonthly"})); 


