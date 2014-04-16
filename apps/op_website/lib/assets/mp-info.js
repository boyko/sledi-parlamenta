// This script collects publicly available information from
// the government's website and prints it to stdout.

var Crawler = require("crawler").Crawler;
var cheerio = require("cheerio");

var c = new Crawler({
  "maxConnections": 10,

  "callback": function(error, result) {
    var langs = [],
        proffs = [],
        nationalAssembly = [],
        bills = [],
        questions = [],
        structures = [],
        speeches = [];

    $ = cheerio.load(result.body);

    // this id has no member attached to it
    if ($("Profile")[0].children.length === 0) {
      return;
    }

    $("Profession > Profession").each(function(idx, el) { proffs[idx] = el.attribs.value });
    $("Language > Language").each(function(idx, el) { langs[idx] = el.attribs.value });
    $("PreviosNA").each(function(idx, el) { nationalAssembly[idx] = el.attribs.value });

    $("ParliamentaryActivity > ParliamentaryStructure").each(function(idx, el) {
      var structure = {
        n: $(el).find("ParliamentaryStructureName")[0].attribs.value,
        t: $(el).find("ParliamentaryStructureType")[0].attribs.value,
        p: $(el).find("ParliamentaryStructurePosition")[0].attribs.value,
        pe: {
          f: $(el).find("From")[0].attribs.value,
          t: $(el).find("To")[0].attribs.value
        }
      };
      structures.push(structure);
    });

    $("Bills > Bill").each(function(idx, el) {
      var bill = {
        n: $(el).find("Name")[0].attribs.value,
        s: $(el).find("Signature")[0].attribs.value,
        d: $(el).find("Date")[0].attribs.value,
        p: $(el).find("ProfileURL")[0].attribs.value.match(/\d+/)[0]
      }
      bills[idx] = bill;
    });

    $("ParliamentaryControl > Question").each(function(idx, el) {
      var question = {
        a:  $(el).find("About")[0].children[0].data,
        t:  $(el).find("To")[0].attribs.value.split(",")[0],
        tp: $(el).find("To")[0].attribs.value.match(",.*")[0].substr(2),
        d:  $(el).find("Date")[0].attribs.value
      }
      questions[idx] = question;
    });

    $("Speeches > Speech").each(function(idx, el) {
      var speech = {
        t:  $(el).find("Topic")[0].children[0].data,
        d:  $(el).find("Date")[0].attribs.value,
        ty: $(el).find("Type")[0].attribs.value
      }
      speeches[idx] = speech;
    });

    var mp = {
      fn: $("FirstName")[0].attribs["value"],
      sn: $("SirName")[0].attribs["value"],
      ln: $("FamilyName")[0].attribs["value"],
      gi: result.req.path.match(/\d+/)[0],
      db: $("DateOfBirth")[0].attribs["value"],
      pb: $("PlaceOfBirth")[0].attribs["value"],
      p: proffs,
      l: langs,
      ms: $("MaritalStatus")[0].attribs["value"],
      pf: $("PoliticalForce")[0].attribs["value"].replace(/ \d+\.\d+%/, ""),
      co: $("Constituency")[0].attribs["value"],
      na: nationalAssembly,
      em: $("E-mail")[0].attribs["value"],
      ws: $("Website")[0].attribs["value"],
      st: structures,
      b: bills,
      q: questions,
      s: speeches
    }

    console.log(JSON.stringify(mp));
  }
});

function fetchAll() {
  var queue = [];
  for (var i = 1; i < 2312; i ++) {
    queue.push("http://www.parliament.bg/export.php/bg/xml/MP/" + i);
  }
  c.queue(queue)
}

function fetchSingle(gov_site_id) {
  c.queue("http://www.parliament.bg/export.php/bg/xml/MP/" + gov_site_id)
}

function init() {
  process.argv.length === 3 ? fetchSingle(process.argv[2]) : fetchAll();
}

init();

