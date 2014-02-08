var Mongoose = require('mongoose')
   , Schema = Mongoose.Schema

require('../extras.js');
var list = ['dataHour', 'dataDaily', 'dataMonthly'];
    var db_list = ['DH', 'DD', 'DM'];
    // var db = Mongoose.connect('mongodb://localhost/dashboard');
function makeSchema(Schema, Mongoose, list, db_list) {
    /* Database */
    

    for (var i = 0; i < db_list.length; i++) {
        //console.log("DB List: " + db_list[i])
        if (db_list[i] === "DM") {
            console.log("DMMM")
            Mongoose.model(db_list[i], new Schema({
                month           :  String, 
                code            :  String,
                status          :  String,
                value           :  Number
            }, {collection  : list[i]}   ));   
        } else {
            Mongoose.model(db_list[i], new Schema({
                date            :  Date,
                time            :  String, 
                code            :  String,
                status          :  String,
                value           :  Number
            }, {collection  : list[i]}   ));
        }
        // console.log("DB List got.. " + db_list[i]);
    };

    var dataHour = Mongoose.model('DH');
    dataHour.find({date: todayDate}, function(err, data){
        console.log(data.length + " items read from collection dataHour.");
    });

    var dataDaily = Mongoose.model('DD');
    dataDaily.find({}, function(err, data){
        console.log(data.length + " items read from collection dataDaily.");
    });

    var dataMonthly = Mongoose.model('DM');
    dataMonthly.find({}, function(err, data){
        console.log(data.length + " items read from collection dataMonthly.");
    });
}
module.exports.makeSchema = makeSchema; 