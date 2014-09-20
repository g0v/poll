var fs = require('fs');
var env = require('jsdom').env;
var jquery = require('jquery');
var mammoth = require("mammoth");

mammoth.convertToHtml({path: "docx/" + process.argv[2] + ".docx"})
.then(function(result){
  var html = result.value;
  env(html, function (errors, window) {
    var $ = require('jquery')(window);

    var result  = [];

    var tr = $('tr');
    for (var i = 2; i < tr.length; i++) {
      item = $('td', tr.eq(i));
      var data = item.eq(3).text().split(',').concat(item.eq(4).text().split(','));
      var neighborhood = [];
      for (var j = data.length - 1; j >= 0; j--) {
        var n = /.+里/.exec(data[j]);
        if (n) {
          n = n[0].replace('全里', '里').replace('里里', '里');
          if (neighborhood.indexOf(n) < 0) {
            neighborhood.push(n);
          }
        }
      };
      result.push(
        {
          'name': item.eq(1).text(),
          'address': item.eq(2).text(),
          'neighborhood': neighborhood,
          'phone': item.eq(5).text()
        }
      );
    };

    fs.writeFileSync(
      "json/" + process.argv[2] + '.json',
      JSON.stringify(result, null, 4)
    );

  });
})
.done();