var fs = require('fs');
var Crawler = require("simplecrawler");
var save_path = '/tmp/';

var scraper = new Crawler();
scraper.timeout = 1000 * 30; // 30 sec timout
scraper.maxConcurency = 10;

var is_single_image = process.argv.length == 2

scraper.on('queueadd', function() {
    console.log(arguments);
});

if (is_single_image) {
    for (var c = 1; c < 2312; ++c) {
        scraper.queue.add('http', 'parliament.bg', 80, '/images/Assembly/' + c + '.png');
    }
} else {
    scraper.queue.add('http', 'parliament.bg', 80, '/images/Assembly/' + process.argv[2] + '.png');
}

// hacky way to skip 404 images
scraper.on('fetch404', function() {
    console.log('404: ' + arguments[0].url);
    scraper.stop();
    scraper.start();
});

// fetch and save
scraper.on('fetchcomplete', function(item, data, response) {
    var name = item.url.split('/').reverse()[0];
    console.log(name);
    if(item.stateData.code != 200) {
        return;
    }

    fs.writeFile(save_path + name, data, function(err) {
        if(err) {
            console.log('Failed to save image ' + name);
        } else {
            console.log(save_path + name);
        }
    });
});

scraper.start();
