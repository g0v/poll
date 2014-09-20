var fs = require('fs');
var https = require('https');
var async = require('async');

var title = process.argv[2];
var list = require('./json/' + title + '.json');

function getLocation (address, cb) {
  https.get('https://maps.googleapis.com/maps/api/geocode/json?address='+address+'&sensor=false', function(res) {
    var body = '';
    res.on('data', function (chunk) {
      body += chunk;
    });

    res.on('end', function () {
      try {
        body = JSON.parse(body);
        if ('ZERO_RESULTS' == body.status) {
          location = {
            lat: 0,
            lng: 0
          }
        } else {
          location = body.results[0].geometry.location;
        }
        setTimeout(function(){
          cb(null, location);
        }, 500);
      }
      catch (err) {
        setTimeout(function(){
          getLocation(address, cb);
        }, 3000);
      }
    });
  });
}

async.mapSeries(list, function (item, cb) {
  console.log('>', item.name, item.address);
  getLocation('台北市' + title + '區' + item.address, function (err, location) {
    item.location = location;
    cb(null, item)
  });
}, function (err, result) {
  fs.writeFileSync(
    'map/' + title + '.json',
    JSON.stringify(result, null, 4)
  );
});