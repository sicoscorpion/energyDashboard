function validateBuildingsInfo(data, list) {
    var current = {};
    var nwInfo = {};

    for (var i = 0; i < list.length; i++) {
        if (list[i].code === data.code) {
            current = list[i];
        }
    };

    nwInfo.code = current.code;
    if (current.name !== data.name) {
        nwInfo.name = data.name;
    } else if (current.type !== data.type) {
        if (data.type !== "academic" || data.type !== "residence"){
            $('#notice').html("Invalid Type, please type academic or residence");
            setTimeout(function() {
                $('#notice').html("")
            }, 3000);
            return false;
        } else {
            nwInfo.type = data.type;
        }
    } else if (current.size !== data.size) {
        nwInfo.size = data.size;
    } else if (current.available !== data.available) {
        console.log(current.available, data.available)
        if (data.available === "Active" || data.available === "inActive"){
            nwInfo.available = data.available;
        } else {
            $('#notice').html("Invalid option, available options are Active or inActive");
            setTimeout(function() {
                $('#notice').html("")
            }, 3000);
            return false;
        }
    } else if (current.profile !== data.profile) {
        nwInfo.profile = data.profile;
    } else if (current.built !== data.built) {
        nwInfo.built = data.built;
    } else if (current.renovated !== data.renovated) {
        nwInfo.renovated = data.renovated;
    } else if (current.feature !== data.feature) {
        nwInfo.feature = data.feature;
    }
    return nwInfo;
    // for (var i = 0; i < Things.length; i++) {
    //     Things[i]
    // };
    // console.log(current);
}

function validateGHGFactor(data, list) {
    var current = list[0].ghg;
    if (data.ghg === current) {

        $('#notice2').html("Nothing to save!");
        setTimeout(function() {
            $('#notice2').html("")
        }, 3000);
        return false;
    }
    return data;
}