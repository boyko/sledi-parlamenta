# Извличане на бизнес занимания по име на физическото лице
## Извличане на данни от търговския регистър

### Изисквания
 - `nodes`  (тествано с `0.10.13`)
 - `phantomjs`  (тествано с `1.9.2`)

За инсталацията на точна, лесно сменима версия на `nodejs` е удобно да се ползва [nvm](https://github.com/creationix/nvm).

Щом има вече работещ `nodejs` , то `phantomjs`  се инсталира лесно: `npm install phantomjs --global` 

### Ограничения на скрипта в момента 
Следните са текущи ограничения, които бъдат премахнати:

    1. се добавят работещи [*"Death By Captcha"*](http://deathbycaptcha.com/user/login) *user* и *pass* в `/common/node/decaptcha/index.js`

### Употреба

```
mkfifo /var/tmp/brrabg
phantomjs --ignore-ssl-errors=true run.js --input=/var/tmp/brrabg --decaptcha=manual
```
Сега процесът ще чака за имена от `/var/tmp/brrabg`. Най-често ще има друг процес, който да пълни `/var/tmp/brrabg` с имена; едно име на всеки ред.

За да сработи примера можем в друг "терминал" да напишем:

```
echo "Иван Иванов Иванов" > /var/tmp/brrabg
```

По начина, който стартирахме crawler-а, ние активирахме ръчното въвеждане на CAPTCHA.
Това означава, че ще трябва въведем текста от свалено във temp директорията CAPTCHA изображение:

```
Type in text from: /var/tmp/captcha.jpg
```

След като въведете текста, ще се изведат намерените бизнес занимания.

### Очакван резултат

```
[{"company":"\"Иван\" ЕООД","title":"Управители"},{"company":"\"Иванушка\" ООД","title":"Съдружници"}]
```


### Demo
![](https://raw.github.com/obshtestvo/rating-gov-representatives/master/apps/brra.bg-inquirer/demo.gif)

### Технологични решения

#### Зашо чист phantomjs, а не нещо друго?

Погледнати бяха:

 - [selenium-webdriver](https://code.google.com/p/selenium/wiki/WebDriverJs), виж след списъка за забележки по webdriver
 - [admc/wd](https://github.com/admc/wd), виж след списъка за забележки по webdriver
 - [WaterfallEngineering/selenium-node-webdriver](https://github.com/WaterfallEngineering/selenium-node-webdriver), виж след списъка за забележки по webdriver
 - [n1k0/casperjs](https://github.com/n1k0/casperjs) - има същия проблем като чисто phantomjs, че не може да ползва nodejs модули. тоест фактически просто е 1 допълнителен слой, който увеличава възможността за бъгове
 - [WaterfallEngineering/SpookyJS](https://github.com/WaterfallEngineering/SpookyJS) - прекалено много абстакция, от phantomjs до casperjs и вече отделно до nodejs.
 - [sheebz/phantom-proxy](https://github.com/sheebz/phantom-proxy), wrapper, тоест няма винаги да е актуален с phantomjs, също превръща всяко повикване към phantomjs в async, което е лудост да се поддръжа
 - [sgentle/phantomjs-node](https://github.com/sgentle/phantomjs-node), wrapper, тоест няма винаги да е актуален с phantomjs, също превръща всяко повикване към phantomjs в async, което е лудост да се поддръжа
 - [alexscheelmeyer/node-phantom](https://github.com/alexscheelmeyer/node-phantom), wrapper, тоест няма винаги да е актуален с phantomjs, също превръща всяко повикване към phantomjs в async, което е лудост да се поддръжа

Тези библиотеки, които следват Webdriver протокола внасят:
 1. Поддръжка на phantomjs под формата на WebDriver сървър. Това 100% означава време в предотратяване на crashes.
 1. Нова API, вместо да може да се ползва js директно. Защо трябва да се учи нов API, ако може просто с JS?

Затова: **с чист phantomjs**.

#### Най-проблемното на phantomjs:

1. Не може да се види http отговора в суров вид.
1. Това, че може да се преглежда само DOM-а води до това че единствено могат да се свалят XML документи, нищо друго
1. Повикването на системни програми в Phantomjs е в много начален стадии. Не може да се подават данни към `stdin` на процеса
1. Това прави невъзможно да се кобинират:
  1. Процес който сваля файл по дадено URL
  1. Процес, чийто `stdin` поема съдържанието на изображение и според съдържанието извършва ..нещо.

#### Възможни решение за JAVA applet-и

 - http://www.froglogic.com/squish/gui-testing/
 - http://stackoverflow.com/questions/10765682/how-to-automate-java-applet
