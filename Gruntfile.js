
var users = require('./models/user.js');
var userInterface = require('./models/interface.js');
require('./helpers/db.js');
module.exports = function(grunt) {

    grunt.registerTask('dbseed', 'seed the database', function() {
        grunt.task.run('adduser:admin:admin@example.com:secret:true');
        grunt.task.run('adduser:jodie:jodie.noiles@acadiau.ca:energy:true');
    });
    grunt.registerTask('seedInterface', 'seed the interface db', function() {
        grunt.task.run('buildInterface:0.798:Welcome to the Acadia University Energy Dashboard. As part of Acadia’s commitment to sustainability, this program was developed to display real-time energy use in all campus facilities to help raise awareness about energy consumption and encourage energy conservation. Here you can view energy usage in each building, challenge another building in a friendly competition to improve performance, and learn more about green initiatives at Acadia and how you can help. The Acadia Energy Dashboard was developed in partnership by the Arthur Irving Academy for the Environment, The Department of Computer Science, the Department of Facilities and Physical Plant Services.');
    });
    grunt.registerTask('adduser', 'add a user to the database', function(usr, emailaddress, pass, adm) {
        // convert adm string to bool
        adm = (adm === "true");

        var user = new users.userModel({ username: usr
        	, email: emailaddress
        	, password: pass
        	, admin: adm });
        
        // save call is async, put grunt into async mode to work
        var done = this.async();

        user.save(function(err) {
            if(err) {
                console.log('Error: ' + err);
                done(false);
            } else {
                console.log('saved user: ' + user.username);
                done();
            }
        });
    });

    // grunt.registerTask('dbdrop', 'drop the database', function() {
    //     // async mode
    //     var done = this.async();

    //     db.mongoose.connection.on('open', function () { 
    //         db.mongoose.connection.db.dropDatabase(function(err) {
    //             if(err) {
    //                 console.log('Error: ' + err);
    //                 done(false);
    //             } else {
    //                 console.log('Successfully dropped db');
    //                 done();
    //             }
    //         });
    //     });
    // });
    grunt.registerTask('buildInterface', 'add the interface database', function(factor, txt) {
        // async mode
        var ui = new userInterface.interfaceModel({ ghg: factor
            , homeText: txt });
        
        // save call is async, put grunt into async mode to work
        var done = this.async();

        ui.save(function(err) {
            if(err) {
                console.log('Error: ' + err);
                done(false);
            } else {
                console.log('saved ghg: ' + ui.ghg);
                console.log('saved Home Text: ' + ui.homeText);
                done();
            }
        });
    });
};