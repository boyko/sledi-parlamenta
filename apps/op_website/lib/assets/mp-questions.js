// This script collects publicly available information from
// the government"s website and prints it to stdout.

var Crawler = require("crawler").Crawler;
var cheerio = require("cheerio");
var queue = [];

var c = new Crawler({
  "maxConnections": 10,

  "callback": function(error, result) {
    var question,
        mgsid = [],
        tmpAns,
        tmpSig;

    $ = cheerio.load(result.body);

    // this id has no question attached to it
    if ($("div.markframe > table").length === 0) {
      return;
    }

    tmpAns = $('td:not(.h1)')[11].children[1].children[1];
    tmpSig = $('td:not(.h1)')[2].children[0];
    tmpQuest = $('td:not(.h1)')[10].children[1].children[1];

    $($('td:not(.h1)')[4]).find('li').each(function(idx, el) {
      mgsid.push(el.children[0].attribs.href.match(/\d+/)[0]);
    });

    question = {
      t:  $('td:not(.h1)')[0].children[0].children[0].data,
      d:  $('td:not(.h1)')[1].children[0].data,
      s:  typeof tmpSig === "undefined" ? false : tmpSig.data,
      m:  $('td:not(.h1)')[3].children[0].data.split(",")[0],
      p:  $('td:not(.h1)')[3].children[0].data.split(",")[1].slice(1),
      mg: mgsid,
      qg: result.uri.match(/\d+/)[0],
      k:  $('td:not(.h1)')[5].children[0].data,
      rt: $('td:not(.h1)')[6].children[0].data,
      dr: $('td:not(.h1)')[7].children[0].data,
      q:  typeof tmpQuest === "undefined" ? false : tmpQuest.children[0].attribs.href
              .replace(/\/pub\/PK\//, ''),
      a:  typeof tmpAns === "undefined" ? false : tmpAns.children[0].attribs.href
    }

    console.log(JSON.stringify(question));
  }
});

for (var i = 10000; i < 10010; i ++) {
  queue.push("http://www.parliament.bg/bg/topical_nature/" + i);
}
c.queue(queue);

