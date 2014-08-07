
## База данни
```sql
--- create database
CREATE SCHEMA `eu-tenders` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci ;
--- grant access
GRANT ALL ON `eu-tenders`.* TO liolio@localhost ;
```

При разработката използвах _MySQL_ със [sequelize][3], конфигурацията се намира във `model/models.js`

Причината да използвам реална база данни, вместо текстов файл:

- гарантирам уникалност на записите създавани при _scrape_ на проект
- не държа всички данни в паметта по време на изпълнение на скрипта


## Команди
```bash
# print out all available commands
node app.js -h
# run all tests
npm test
# run a single test (npm install -g mocha)
mocha -g 'scrape project page'
# run the script
npm start
# run the admin (npm install -g express-admin)
# user: admin, pass: 11aaAA
admin x-admin/
```

## Модел
![eu-tenders][2]


## Етап 1
Обхождам [списъка с проекти][1], за да взема техните `id`та.

Освен това попълвам и _Място на изпълнение_ `place`, тъй като е форматирано добре. Отделните компоненти са разделени с `;`

Взимам и _Продължителност месеци_ `duration`, тъй като не намерих тази извадка на страницата за проект

Този етап е бавен тъй като техният сървър прави заявка към базата за всички записи. Освен това тегленето на страници е последователно, тъй като се използва `__VIEWSTATE` от предходната. Отне 2 часа и 15 минути за 1150 заявки/страници


## Етап 2
Правя заявка за всеки `project` запис в базата, за да попълня липсващата информация.

Този етап е по-бърз, тъй като заявката на техният сървър отнема по-малко време, и дърпам по 5 проекта паралелно. Отне 45 минути за 11465 заявки


## Изпълнение
1. Създаване на базата по някакъв начин, виж командите в началото
2. Инсталация
	```bash
	cd eu-tenders
	npm install
	```
3. Синхронизация на моделите с базата
	```bash
	npm app.js -s
	```
4. Стартиране на скрипта
	```bash
	npm start
	```


  [1]: http://umispublic.government.bg/prProcedureProjectsInfo.aspx?op=-1&proc=-2&clear=1
  [2]: http://i.imgur.com/ZqSjLA8.png
  [3]: https://github.com/sequelize/sequelize
