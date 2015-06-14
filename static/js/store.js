function updateAccount(name, password) {
    "use strict";
    var data = {};
    data.name = name;
    data.password = password;console.log(data);
    $.ajax({
        type: 'POST', 
        contentType: 'application/json',
        data: JSON.stringify(data),
        url: '/updateAccount',
        success: function(data){
            // data = msg;
            $('#notice').html(data)
            setTimeout(function() {
                $('#notice').html("")
            }, 1000)
            
            console.log(data);

        }
    });
    return data;
}

function updateBuildingInfo(data) {
    "use strict";

    $.ajax({
        type: 'POST', 
        contentType: 'application/json',
        data: JSON.stringify(data),
        url: '/updateBuildingInfo',
        success: function(data){
            // data = msg;
            $('#notice').html(data)
            setTimeout(function() {
                $('#notice').html("")
            }, 3000)
            
            console.log(data);

        }
    });
    return data;
}

function updateGHGFactor(data) {
    "use strict";
    console.log(JSON.stringify(data))
    $.ajax({
        type: 'POST', 
        contentType: 'application/json',
        data: JSON.stringify(data),
        url: '/updateGHG',
        success: function(data){
            // data = msg;
            $('#notice2').html(data)
            setTimeout(function() {
                $('#notice2').html("")
            }, 3000)
            
            console.log(data);

        }
    });
    return data;
}

function createCompetition(data) {
    "use strict";
    console.log(JSON.stringify(data))
    $.ajax({
        type: 'POST', 
        contentType: 'application/json',
        data: JSON.stringify(data),
        url: '/createCompetition',
        success: function(data){
            // data = msg;
            $('#notice').html(data)
            setTimeout(function() {
                $('#notice').html("")
            }, 3000)
            
            console.log(data);

        }
    });
    return data;
}

function updateCompetition(data) {
    "use strict";
    console.log(JSON.stringify(data))
    $.ajax({
        type: 'POST', 
        contentType: 'application/json',
        data: JSON.stringify(data),
        url: '/updateCompetition',
        success: function(data){
            // data = msg;
            $('#notice').html(data)
            setTimeout(function() {
                $('#notice').html("")
            }, 3000)
            
            console.log(data);

        }
    });
    return data;
}

function removeCompetition(val) {
    "use strict";
    console.log(JSON.stringify(val))
    var data = [val]
    $.ajax({
        type: 'POST', 
        contentType: 'application/json',
        data: JSON.stringify(data),
        url: '/removeCompetition',
        success: function(data){
            // data = msg;
            $('#notice').html(data)
            setTimeout(function() {
                $('#notice').html("")
            }, 3000)
            
            console.log(data);

        }
    });
    return data;
}
