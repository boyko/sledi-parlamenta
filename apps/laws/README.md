## Какво прави
Скриптът извлича информация новоприетите закони публикувани в http://www.parliament.bg/ .

## Очакван резултат
Информацията за всеки закон е представена като `JSON` документ под формата:

```json
{
   "lawTextHtml":"<p>&nbsp;</p><br>......</span></div>",
   "importers":[
      {
         "name":"ДАНИЕЛА АНАСТАСОВА ДАРИТКОВА-ПРОДАНОВА",
         "link":"http://www.parliament.bg/bg/MP/994"
      },
      {
         "name":"МЕНДА КИРИЛОВА СТОЯНОВА",
         "link":"http://www.parliament.bg/bg/MP/953"
      },
      {
         "name":"ЛЪЧЕЗАР БОГОМИЛОВ ИВАНОВ",
         "link":"http://www.parliament.bg/bg/MP/1016"
      }
   ],
   "committees":[
      {
         "name":"КОМИСИЯ ПО ЗДРАВЕОПАЗВАНЕТО",
         "link":"http://www.parliament.bg/bg/archive/7/3/233"
      }
   ],
   "history":[
      {
         "date":"20/12/2012",
         "action":"внесен(зала първо четене)"
      },
      {
         "date":"20/12/2012",
         "action":"приет(зала първо четене)"
      },
      {
         "date":"10/01/2013",
         "action":"внесен(зала второ четене)"
      },
      {
         "date":"10/01/2013",
         "action":"приет(зала второ четене)"
      }
   ],
   "reports":[
      {
         "name":"Доклад на КОМИСИЯ ПО ЗДРАВЕОПАЗВАНЕТО",
         "link":"/bg/parliamentarycommittees/members/233/reports/ID/3958"
      }
   ],
   "lawName":"Закон за допълнение на Закона за здравното осигуряване",
   "signature":"254-01-119",
   "createdOn":"15/12/2012",
   "revisionId":"Десета сесия",
   "stateGazetteIssue":[
      4,
      2013
   ],
   "billName":"Законопроект за допълнение на Закона за здравното осигуряване"
}
```

### Demo
![](https://raw.github.com/obshtestvo/rating-gov-representatives/master/apps/mp-votes/demo.gif)


## Изисквания
 - `nodejs` (тествано с `0.10.13`)
 - `npm`

За инсталацията на точна, лесно сменима версия на `nodejs` е удобно да се ползва [nvm](https://github.com/creationix/nvm)

## Инсталация

След като имате горните изисквания, влезте в директорията на `laws` и изпълнете:

```
npm install
```

Това ще се погрижи, за да са на лице всички нужни модули.

## Употреба
```bash
node run.js --url=http://www.parliament.bg/bg/laws
```

което ще изведе поредица от `json` документи, с по един документ на 1 ред, тоест:

```json
{"lawTextHtml":"...........</span></div>","importers":[{"name":"ДАНИЕЛА АНАСТАСОВА ДАРИТКОВА-ПРОДАНОВА","link":"http://www.parliament.bg/bg/MP/994"},{"name":"МЕНДА КИРИЛОВА СТОЯНОВА","link":"http://www.parliament.bg/bg/MP/953"},{"name":"ЛЪЧЕЗАР БОГОМИЛОВ ИВАНОВ","link":"http://www.parliament.bg/bg/MP/1016"}],"committees":[{"name":"КОМИСИЯ ПО ЗДРАВЕОПАЗВАНЕТО","link":"http://www.parliament.bg/bg/archive/7/3/233"}],"history":[{"date":"20/12/2012","action":"внесен(зала първо четене)"},{"date":"20/12/2012","action":"приет(зала първо четене)"},{"date":"10/01/2013","action":"внесен(зала второ четене)"},{"date":"10/01/2013","action":"приет(зала второ четене)"}],"reports":[{"name":"Доклад на КОМИСИЯ ПО ЗДРАВЕОПАЗВАНЕТО","link":"/bg/parliamentarycommittees/members/233/reports/ID/3958"}],"lawName":"Закон за допълнение на Закона за здравното осигуряване","signature":"254-01-119","createdOn":"15/12/2012","revisionId":"Десета сесия","stateGazetteIssue":[4,2013],"billName":"Законопроект за допълнение на Закона за здравното осигуряване"}
 ```

Ето и _"help"_-а на скрипта за повече яснота:

```
Crawls parliament.bg and extracts laws infromation.
Usage: node ./run.js

Options:
  -u, --url                 Url to act as a start page for the crawl                      [required]
  -d, --date                Date as unix time. Start date for the crawl
  -l, --loggerSettingsFile  Settings for the logger. Accepts a filepath to the config file. If not
                            provided, settings default to logging to error.log file
```