
var cheerio = require('cheerio'),
    moment = require('moment');


exports.projects = {
    total: function (html) {
        var $ = cheerio.load(html);

        return {
            viewstate: $('#__VIEWSTATE').val(),
            total: parseInt($('#ContentPlaceHolder1_lblMaxRows')
                            .text().trim().replace('Общ брой: ',''))
        };
    },
    page: function (html) {
        var $ = cheerio.load(html);

        var projects = [];
        $('.InfoTableProposal tr').each(function (index) {
            if (!index) return;
            projects.push({
                id: parseInt($('td',this).eq(3).find('a').attr('href').replace(/.*id=(\d+).*/,'$1')),
                place: $('td',this).eq(2).text().trim(),
                duration: parseFloat($('td',this).eq(8).text().trim())
            });
        });

        return {
            viewstate: $('#__VIEWSTATE').val(),
            projects: projects
        };
    }
};


exports.project = {
    page: function (html) {
        var $ = cheerio.load(html);
        var project = {}, ref = {beneficiary:null, program:null, partners:[], executors: []};

        function span (ctx, row) {
            return $('tr',ctx).eq(row).find('td').eq(1).find('span');
        }
        function a (ctx, row) {
            return $('tr',ctx).eq(row).find('td').eq(1).find('a');
        }

        (function identification (ctx) {
            project.isun = span(ctx,1).text().trim();
            project.number = span(ctx,2).text().trim();
            project.number = (project.number == '---') ? null : project.number;			
            project.name = span(ctx,3).text().trim();

            ref.beneficiary = {
                id: parseInt(a(ctx,4).attr('href').replace(/.*benef=(\d+).*/,'$1')),
                name: a(ctx,4).text().trim()
            };
            project.beneficiary_id = ref.beneficiary.id;

            ref.program = {
                id: parseInt(a(ctx,5).attr('href').replace(/.*op=(\d+).*/,'$1')),
                name: a(ctx,5).text().trim(),
                source: span(ctx,5).text().trim().replace('==>','').trim()
            };
            project.program_id = ref.program.id;

            project.date_contract = moment(span(ctx,6).text().trim(), 'DD.MM.YYYY').format('YYYY-MM-DD');
            project.date_begin = moment(span(ctx,7).text().trim(), 'DD.MM.YYYY').format('YYYY-MM-DD');
            project.date_end = moment(span(ctx,8).text().trim(), 'DD.MM.YYYY').format('YYYY-MM-DD');

            project.status = span(ctx,9).text().trim();
        }($('#ContentPlaceHolder1_divIdentification')));

        
        (function description (ctx) {
            project.description = span(ctx,1).html().trim();
            project.activities = span(ctx,2).html().trim();
        }($('#ContentPlaceHolder1_divDescription')));


        (function partners (ctx) {
            if (!$('table', ctx).length) return;
            $('tr', ctx).each(function (index) { 
                ref.partners.push({
                    id:parseInt($('a', this).attr('href').replace(/.*benef=(\d+).*/,'$1')),
                    name:$('a', this).text().trim()
                });
            });
        }($('#ContentPlaceHolder1_tdPartners')));

        
        (function executors (ctx) {
            if (!$('table', ctx).length) return;
            $('tr', ctx).each(function (index) {
                ref.executors.push({
                    id:parseInt($('a', this).attr('href').replace(/.*benef=(\d+).*/,'$1')),
                    name:$('a', this).text().trim()
                });
            });
        }($('#ContentPlaceHolder1_tdExecutors')));

        
        (function financial (ctx) {
            project.budget_approved = parseInt(span(ctx,1).text().trim().replace(' BGN','').replace(' ','')||0);
            project.budget_total = parseInt(span(ctx,2).text().trim().replace(' BGN','').replace(' ','')||0);
            project.budget_bfp_total = parseInt(span(ctx,3).text().trim().replace(' BGN','').replace(' ','')||0);
            project.budget_paid = parseInt(span(ctx,4).text().trim().replace(' BGN','').replace(' ','')||0);

            var bfp = null;

            bfp = $('#ContentPlaceHolder1_tdBFP_EU_AssumedAmount').text().trim().replace(' ','');
            project.budget_bfp_eu = bfp ? parseInt(bfp||0) : 0;

            bfp = $('#ContentPlaceHolder1_tdBFP_National_AssumedAmount').text().trim().replace(' ','');
            project.budget_bfp_nat = bfp ? parseInt(bfp||0) : 0;
            
            bfp = $('#ContentPlaceHolder1_tdBenef_AssumedAmount').text().trim().replace(' ','');
            project.budget_benef = bfp ? parseInt(bfp||0) : 0;
        }($('#ContentPlaceHolder1_divFinansicalInfo')));

        
        (function indicators (ctx) {
            
        }($('#ContentPlaceHolder1_divIndicators')));


        return {project:project, ref:ref};
    }
};
