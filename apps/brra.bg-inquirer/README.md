# Извличане на бизнес занимания по име на физическото лице
## Извличане на данни от търговския регистър

### Phantomjs setup

Просто сваляте от:
http://phantomjs.org/download.html

И добавяте в `.bashrc`, `.zshrc`  (или др. каквото ползвате) към `$PATH`:

```
/path/to/downloaded/phantomjs/bin
```

### Ограничения на скрипта в момента 
Следните са текущи ограничения, които бъдат премахнат скоро:

  - прави се само 1 търсене, т.е. търсят се фирми само на 1 физ. лице
  - името на физическото лице е фиксирано в самия код.
  - видът на decaptcha е фиксиран на *"ръчен"*; може лесно да се подмени с автоматичен като:
    1. се откоментира ред №4 и закоментира №3 от `run.js`
    1. се добавят работещи *"Death By Captcha"* *user* и *pass* в `/common/node/decaptcha/index.js`

### Употреба

```
phantomjs --ignore-ssl-errors=true run.js
```

Като в текущия, полуавтоматичен вид ще поиска да въведете текста от свалено във temp директорията CAPTCHA изображение:

```
Type in text from: /var/tmp/captcha.jpg
```

След като въведете текста, ще се изведат намерените бизнес занимания във вида:

```
[{"company":"\"Иван\" ЕООД","title":"Управители"},{"company":"\"Иванушка\" ООД","title":"Съдружници"}]
```

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

