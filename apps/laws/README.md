# UNFINISHED

## Какво прави
Скриптът извлича информация новоприетите закони публикувани в http://www.parliament.bg/ .

За момента информацията е сведена до:

 - заглавие на закона
 - заглавие на законопроекта

## Очакван резултат
?????????? `JSON` документ под формата:

```json
??????????????
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
??????????????????????
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