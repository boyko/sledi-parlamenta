## XLS файлове към CSV
Конвертор на публикуваните в parliament.bg Еxcel-ски файлове към по-лесни за препработка CSV файлове.

### Изисква
 - `php5` (за debian-базирани: `sudo apt-get install php5`)
 - `composer` (http://getcomposer.org/`)

### Пример за употреба

```bash
php spreadsheet2csv.php -f ../../data/samples/votes-individual.xls -o test.csv
```