var fs = require('fs');
var https = require('https');
var async = require('async');

var byPoll = function (title, cb) {
  var list = require('./map/' + title);

  var result = {};

  for (var i = 0; i < list.length; i++) {
    var form = list[i];

    if (!result[form.address]) {
      result[form.address] = {};
      result[form.address].name = form.name;
      result[form.address].phone = form.phone;
      result[form.address].location = form.location;
      result[form.address].neighborhood = [];
      result[form.address].power = 0;
    }

    var to = result[form.address];

    to.power += 1;

    var nameReg = new RegExp(form.name.replace('(', '').replace(')', '').split('').join('?') + '?');
    to.name = nameReg.exec(to.name)[0].replace(/中\d+年.*/, '中').replace(/小\d+年.*/, '小');

    for (var j = form.neighborhood.length - 1; j >= 0; j--) {
      var neigh = form.neighborhood[j];
      if (to.neighborhood.indexOf(neigh) < 0) {
        to.neighborhood.push(neigh);
      }
    };
  };

  var data = [];
  Object.keys(result).forEach(function(key) {
    data.push(
      {
          "name": result[key].name,
          "address": key,
          "neighborhood": result[key].neighborhood,
          "phone": result[key].phone,
          "location": result[key].location,
          "power": result[key].power
      }
    );
  });

  fs.writeFileSync(
    'byPoll/' + title,
    JSON.stringify(data, null, 4)
  );

  cb();
}

async.each(fs.readdirSync('./map'), byPoll);