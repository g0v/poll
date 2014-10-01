var fs = require('fs');
var env = require('jsdom').env;
var async = require("async");
var iconv = require('iconv-lite');

var parseCSV = function (filename, cb) {
  var list = fs.readFileSync('./csv/' + filename);
  list = iconv.decode(list, "big5");
  list = list.split("\n");

  var result = [];

  for (var i = 6; i < list.length; i++) {
    var item = list[i].split(',');
    result.push(
      {
        "name": item[1].replace('"',''),
        "address": item[2].replace('"',''),
        "neighborhood": item[3].replace('"','')
      }
    );
  };


  fs.writeFileSync(
    'json/' + filename.replace('.csv','.json'),
    JSON.stringify(result, null, 4)
  );

  cb();
}

async.each(fs.readdirSync('./csv'), parseCSV);