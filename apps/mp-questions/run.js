// We need this to build our post string
var querystring = require('querystring');
var http = require('http');
var cheerio = require('cheerio');
var Crawler = require("simplecrawler");

var scraper = new Crawler();
var scraper_started = false;
scraper.timeout = 1000 * 30; // 30 sec timout
scraper.maxConcurency = 10;

var question_data = [];
var base_url = 'http://www.parliament.bg/bg/topical_nature/';

// collect MPIDs and MIDs
http.get({
    hostname: 'www.parliament.bg', 
    port: 80,
    path: '/bg/topical_nature/',
    headers: {
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'User-Agent': 'Mozilla/5.0 (X11; Linux i686) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/34.0.1847.132 Safari/537.36',
        'Accept-Language': 'bg,en-GB;q=0.8,en;q=0.6'
    }
}, function(res) {
    var body = '';
    res.on('data', function(data) {
        body += data.toString();
    });
    
    res.on('end', function() {
        $ = cheerio.load(body);

        var mid = [], mpid = [];

        $('#MID option').each(function(idx, el) {
            mid.push($(el).val());
        });

        $('#MPID option').each(function(idx, el) {
            mpid.push($(el).val());
        });

        // collection question ids 
        gather_ids(mid, mpid);
    });
});

function get_request (mid, mpid) {
    var post_data = querystring.stringify({
        'ANOT': '',
        'MID': mid,
        'MPID': mpid,
        'submit': 'Търси'
    });
    return {
        options: {
            host: 'www.parliament.bg',
            port: '80',
            path: '/bg/topical_nature',
            method: 'POST',
            headers: {
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                'User-Agent': 'Mozilla/5.0 (X11; Linux i686) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/34.0.1847.132 Safari/537.36',
                'Accept-Language': 'bg,en-GB;q=0.8,en;q=0.6',
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': post_data.length
            }
        },
        data: post_data
    };
}

function gather_ids (mid, mpid) {
    var request_que = [];

    for (var c = 0; c < mid.length; ++c) {
        request_que.push(get_request('', mid[c]));
    }
    for (var c = 0; c < mpid.length; ++c) {
        request_que.push(get_request(mpid[c], ''));
    }

    for (var c = 0; c < request_que.length; ++c) {

        var post_req = http.request(request_que[c].options, function(res) {
            var body = '';
            res.on('data', function(data) {
                body += data.toString();
            });
            res.on('end', function() {
                parse_page(body);
            });
        });

        post_req.write(request_que[c].data);
        post_req.end();
    }
}

function parse_page (html) {
    $ = cheerio.load(html);
    $('#leftcontent1 div.markframe table.billsresult a').each(function(idx) {
        var href = $(this).attr('href');
        if (href.match(/topical_nature\/\d+/)) {
            scraper.queue.add(
                'http',
                'www.parliament.bg',
                80,
                '/bg/topical_nature/' + href.split('/').reverse()[0]
            );
            if (!scraper_started) {
                scraper_started = true;
                scraper.start();
            }
        }
    });
}


// parse question page
scraper.on('fetchcomplete', function(item, data, response) {
    $ = cheerio.load(data.toString());
    var question = {
        url: item.url
    };

    $('table.bills tr').each(function(idx) {
        if (idx == 0) {
            return true;
        }

        var key = (function(key) {
            return {
                'Текст на въпроса': 'response',
                'Текст на отговор': 'question',
                'Дата': 'date',
                'Входящ номер': 'signature',
                'Адресат': 'respondent',
                'Вносител': 'questioner',
                'Вид на отговора': 'response_type',
                'Статус': 'status',
                'Планирана дата на отговор': 'planned_response_date',
                'Дата на връчване на писмен отговор': 'actual_response_date',
                'Дата на отговор': 'response_date'
            }[key];
        })($(this).find('td').first().text());

        var value = $(this).find('td').first().next().text().replace(/\s+/g, ' ');

        if (value.replace(/\s+/g, '').length) {
            if (key == 'questioner') {
                var submitters = [];
                $(this).find('a').each(function() {
                    submitters.push(
                        parseInt($(this).attr('href').split('/').reverse()[0])
                    );
                });
                question[key] = submitters;
            } else if (key == 'response' && $(this).find('a').length) {
                var answers = [];
                $(this).find('a').each(function() {
                    answers.push($(this).attr('href').split('/').reverse()[0]);
                });
                question[key] = answers.length > 1 ? answers : answers[0];
            } else if(key == 'question') {
                question[key] = $(this).find('a').first().attr('href').split('/').reverse()[0];
            } else {
                question[key] = value;
            }
        }
    });
    question_data.push(question);
});

scraper.on('complete', function() {
    console.log(JSON.stringify(question_data));
});
