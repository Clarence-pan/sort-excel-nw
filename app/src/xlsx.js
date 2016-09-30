var fs = require('fs');
var xlsx = require('xlsx');
var _ = require('lodash');

module.exports = xlsx;


xlsx.readFile = function(fileName, options){
    var data = fs.readFileSync(fileName);
    //alert(typeof data + ": "+(data.constructor));
    return xlsx.read(data, _.extend(options||{}, {type: 'buffer'}));
};

xlsx.writeFile = function(workbook, fileName, options){
    try {
        var data = xlsx.write(workbook, _.extend(options || {}, {type: 'buffer'}));
        return fs.writeFileSync(fileName, data);
    } catch (e){
        throw e;
    }
};

function dir (obj, onlyOwned) {
    if (obj === null) {
        return '<null>';
    } else if (typeof obj === 'undefined') {
        return '<undefined>';
    }

    var keys = {};
    for (var k in obj) {
        if (!obj.hasOwnProperty(k) && onlyOwned) {
            continue;
        }

        var v = obj[k];
        if (typeof v === 'function') {
            keys[k] = '<function>';
        } else if (typeof v === 'object') {
            keys[k] = '<object>';
        } else {
            keys[k] = v;
        }
    }

    return keys;
}