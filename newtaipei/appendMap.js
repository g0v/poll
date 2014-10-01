var fs = require('fs');
var https = require('https');
var async = require('async');

var filename = process.argv[2];
var list = require('./json/' + filename + '.json');

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
          console.log('[WARNING]', address);
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
  getLocation('新北市' + filename + item.address, function (err, location) {
    item.location = location;
    cb(null, item)
  });
}, function (err, result) {
  fs.writeFileSync(
    'map/' + filename + '.json',
    JSON.stringify(result, null, 4)
  );
});