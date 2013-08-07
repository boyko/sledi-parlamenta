# Извличане на бизнес занимания по име на физическото лице
## Извличане на данни от търговския регистър
Засега тестовете показват че адаптера на `nodejs` за `phantomjs` хич не е як.

В момента успешно е тествано, че с `phantomjs` може да се обхожда сайт с `javascript` линкове и сесии

Тествано е фактически със сайта на държавния вестник, но самия резултат потвърждава същото

Може да тествате и Вие. Щом изпълните:
```
phantomjs pure_phantomjs_test.js
```

ще има създаден `export.png` файл в същата папка, който изобразява *"screenshot"* от сайта на държавния вестник. Важното в този *"screenshot"* е, че по него може да се види заредената страница, и тя не е началната, тоест навигацията е била успешна.

## Phantomjs setup

Просто сваляте от:
http://phantomjs.org/download.html

И добавяте в .bashrc, .zshrc  (или др каквото ползвате) към $PATH:

```
/path/to/downloaded/phantomjs/bin
```


## Судо код за crawl + decaptcha на brra.bg

```
nodejs ./captcha-server.js &
phantomjs ./crawler.js
```

В момента е само судо код, но при готовност ще извежда json обекти с фирмите и позициите на търсеното лице.


## Зашо чист phantomjs, а не нещо друго?

Погледнати бяха:

 - [**selenium-webdriver**](https://code.google.com/p/selenium/wiki/WebDriverJs), виж след списъка за забележки по webdriver
 - [admc/**wd**](https://github.com/admc/wd), виж след списъка за забележки по webdriver
 - [WaterfallEngineering/**selenium-node-webdriver**](https://github.com/WaterfallEngineering/selenium-node-webdriver), виж след списъка за забележки по webdriver
 - [n1k0/**casperjs**](https://github.com/n1k0/casperjs) - има същия проблем като чисто phantomjs, че не може да ползва nodejs модули. тоест фактически просто е 1 допълнителен слой, който увеличава възможността за бъгове
 - [WaterfallEngineering/**SpookyJS**](https://github.com/WaterfallEngineering/SpookyJS) - прекалено много абстакция, от phantomjs до casperjs и вече отделно до nodejs.
 - [sheebz/**phantom-proxy**](https://github.com/sheebz/phantom-proxy), wrapper, тоест няма винаги да е актуален с phantomjs, също превръща всяко повикване към phantomjs в async, което е лудост да се поддръжа
 - [sgentle/**phantomjs-node**](https://github.com/sgentle/phantomjs-node), wrapper, тоест няма винаги да е актуален с phantomjs, също превръща всяко повикване към phantomjs в async, което е лудост да се поддръжа
 - [alexscheelmeyer/**node-phantom**](https://github.com/alexscheelmeyer/node-phantom), wrapper, тоест няма винаги да е актуален с phantomjs, също превръща всяко повикване към phantomjs в async, което е лудост да се поддръжа

Тези библиотеки, които следват Webdriver протокола внасят:
 1. Поддръжка на phantomjs под формата на WebDriver сървър. Това 100% означава време в предотратяване на crashes.
 1. Нова API, вместо да може да се ползва js директно. Защо трябва да се учи нов API, ако може просто с JS?

Затова: **с чист phantomjs**.

## Най-проблемното на phantomjs:

1. Не може да се види http отговора в суров вид.
1. Това, че може да се преглежда само DOM-а води до това че единствено могат да се свалят XML документи, нищо друго
1. Повикването на системни програми в Phantomjs е в много начален стадии. Не може да се подават данни към `stdin` на процеса
1. Това прави невъзможно да се кобинират:
  1. Процес който сваля файл по дадено URL
  1. Процес, чийто `stdin` поема съдържанието на изображение и според съдържанието извършва ..нещо.

