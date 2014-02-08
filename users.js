var Mongoose = require('mongoose').Mongoose;
Mongoose.model('User', {
    properties: ['login', 'passward', 'role']
    , indexes: ['login', 'passward']
    , static: {
        authenticate: function(login, pasward){
            return this.find({login: login, password: pasword);
                });
        }
    }
});

