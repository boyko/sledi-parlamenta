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
        name:     $(el).find("ParliamentaryStructureName")[0].attribs.value,
        type:     $(el).find("ParliamentaryStructureType")[0].attribs.value,
        position: $(el).find("ParliamentaryStructurePosition")[0].attribs.value,
        from:     $(el).find("From")[0].attribs.value,
        to:       $(el).find("To")[0].attribs.value
      };
      structures.push(structure);
    });

    $("Bills > Bill").each(function(idx, el) {
      var bill = {
        name:        $(el).find("Name")[0].attribs.value,
        signature:   $(el).find("Signature")[0].attribs.value,
        date:        $(el).find("Date")[0].attribs.value,
        gov_site_id: $(el).find("ProfileURL")[0].attribs.value.match(/\d+/)[0]
      }
      bills[idx] = bill;
    });

    $("ParliamentaryControl > Question").each(function(idx, el) {
      var question = {
        topic:               $(el).find("About")[0].children[0].data,
        respondent:          $(el).find("To")[0].attribs.value.split(",")[0],
        respondent_position: $(el).find("To")[0].attribs.value.match(",.*")[0].substr(2),
        date:                $(el).find("Date")[0].attribs.value
      }
      questions[idx] = question;
    });

    $("Speeches > Speech").each(function(idx, el) {
      var speech = {
        topic: $(el).find("Topic")[0].children[0].data,
        date:  $(el).find("Date")[0].attribs.value,
        type:  $(el).find("Type")[0].attribs.value
      }
      speeches[idx] = speech;
    });

    var member_of_parliament = {
      first_name:      $("FirstName")[0].attribs["value"],
      sir_name:        $("SirName")[0].attribs["value"],
      last_name:       $("FamilyName")[0].attribs["value"],
      gov_site_id:     result.req.path.match(/\d+/)[0],
      date_of_birth:   $("DateOfBirth")[0].attribs["value"],
      place_of_birth:  $("PlaceOfBirth")[0].attribs["value"],
      professions:     proffs,
      languages:       langs,
      marital_status:  $("MaritalStatus")[0].attribs["value"],
      political_force: $("PoliticalForce")[0].attribs["value"].replace(/ \d+\.\d+%/, ""),
      constituency:    $("Constituency")[0].attribs["value"],
      email:           $("E-mail")[0].attribs["value"],
      website:         $("Website")[0].attribs["value"],
      structures:      structures,
      bills:           bills,
      questions:       questions,
      speeches:        speeches
    }

    console.log(JSON.stringify(member_of_parliament));
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

