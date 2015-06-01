var Mongoose = require('mongoose'),
    Schema = Mongoose.Schema,
    bcrypt = require('bcrypt'),
    SALT_WORK_FACTOR = 10;

var passport = require('passport'),
    user = require('../models/user.js');
    buildings = require('../models/buildings.js');
    userInterface = require('../models/interface.js');
    competitions = require('../models/competitions.js');
    helpers = require('../helpers/extras.js');

      
exports.admin = function(req, res) {
  res.render('manage', { user: req.user, message: req.session.messages, sess: "manager" });
};

var users = Mongoose.model('user');
// var competitions = Mongoose.model('comps');
// var buildings = Mongoose.model('user');
// POST /login
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
//
//   curl -v -d "username=bob&password=secret" http://127.0.0.1:3000/login
//   
/***** This version has a problem with flash messages
app.post('/login', 
  passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }),
  function(req, res) {
    res.redirect('/');
  });
*/
  
// POST /login
//   This is an alternative implementation that uses a custom callback to
//   acheive the same functionality.
exports.postlogin = function(req, res, next) {
    passport.authenticate('local', function(err, user, info) {
        if (err) { return next(err) }
        if (!user) {
            req.session.messages =  [info.message];
            return res.redirect('/admin')
        }
        req.logIn(user, function(err) {
            if (err) { return next(err); }
            return res.redirect('/manage');
        });
    })(req, res, next);
};

exports.logout = function(req, res) {
    req.logout();
    res.redirect('/admin');
};

exports.updateAccount = function(req, res) {
    console.log(req.body.name);
    var name = req.body.name;
    var pass = req.body.password;
    user.userModel.findOne({username : name}, function(err, user){
        var hashedPass = "";
        if (!user) {
            console.log(err);
            res.send("invalid username");
        } else {
            console.log(user);

            bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
                if(err) return next(err);

                bcrypt.hash(pass, salt, function(err, hash) {
                    if(err) return next(err);
                    hashedPass = hash;
                    users.update({username : name}, {password: hashedPass}, function(err, msg){
                        if (err) {
                            console.log(err);
                            res.send("update failed for: ", name);
                        } else {
                            res.send("succesfully updated!");
                        }
                    });
                    console.log(hashedPass);
                });
            });
            
        }
    });

}

exports.updateBuildingInfo = function(req, res) {
    var building = req.body;

    buildings.buildingModel.findOne({code: building.code}, function(err,data) {
        if (!data) {
            console.log(err);
            res.send("invalid building");
        } else {
            var size = helpers.ObjectSize(building)
            buildings.buildingModel.update({code: building.code}, building, function(err, data) {
                if (err) {
                    console.log(err);
                    res.send("update failed for: ", building.code); 
                } else {
                    res.send("succesfully updated!");
                }
            })
            // res.send("valid building")
        }
    });
}

exports.updateGHG = function(req, res) {
    var ghg = req.body.ghg;
    userInterface.interfaceModel.update({ghg: ghg}, function(err, data) {
        if (err) {
            console.log(err);
            res.send("update failed for: ", ghg); 
        } else {
            res.send("succesfully updated!");
        }
    });
}

exports.createCompetition = function(req, res) {
    var competition = req.body;
    var data = new competitions.competitionsModel(competition);
    data.save(function(err, data){
        if (err) {
            console.log(err);
            res.send("Creating competition failed: ", err); 
        } else {
            res.send("succesfully created!");
        }
    });
}

exports.updateCompetition = function(req, res) {
    var competition = req.body;
    competitions.competitionsModel.findOne({code: competition.code}, function(err, data){
        if (!data) {
            console.log(err);
            res.send("invalid competition");
        } else {
            competitions.competitionsModel.update({code: competition.code}, competition, function(err, data) {
                console.log(data)
                if (err) {
                    console.log(err);
                    res.send("update failed for: ", competition.code); 
                } else {
                    res.send("succesfully updated!");
                }
            });
        }
    });
}

exports.removeCompetition = function(req, res) {
    var competitionID = parseInt(req.body[0]);
    console.log(competitionID);
    // competitions.competitionsModel.findOne({code: competitionID}, function(err, data) {
    competitions.competitionsModel.remove({code: competitionID}, function(err, data) {
        if (err) {
            console.log(err);
            res.send("Removing competition failed: ", err); 
        } else {
            res.send("Succesfully removed!");
        }
    });
    
}