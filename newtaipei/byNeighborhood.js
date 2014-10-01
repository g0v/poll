var fs = require('fs');
var https = require('https');
var async = require('async');

var byNeighborhood = function (title, cb) {
  if (!/.+\.json$/.exec(title)) {
    cb();
    return;
  }
  
  var list = require('./map/' + title);

  var result = {};
  for (var i = 0; i < list.length; i++) {
    var form = list[i];

    for (var j = form.neighborhood.length - 1; j >= 0; j--) {
      var neigh = form.neighborhood[j];
      if (!result[neigh]) {
        result[neigh] = [];
      }
      result[neigh].push(
        {
            "name": form.name,
            "address": form.address,
            "phone": form.phone,
            "location": form.location,
        }
      )
    };
  };

  fs.writeFileSync(
    'byNeighborhood/' + title,
    JSON.stringify(result, null, 4)
  );

  cb();
}

async.each(fs.readdirSync('./map'), byNeighborhood);