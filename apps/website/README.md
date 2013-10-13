## Includes
**...да се допише...**

## Requirements
 - nginx server
 - uwsgi server
 - uwsgi python plugin
 - pip (python package manager)
 - django
 - virtualenvwrapper
 - mysql driver and its dependencies

### Installing requirements

```sh
sudo apt-get install nginx-full uwsgi uwsgi-plugin-python python-pip && sudo pip install django virtualenvwrapper
```
and for the capricious MySQL:

```sh
sudo apt-get install libmysqlclient-dev python-dev
```

### App setup

```sh
# django-admin.py startproject openparliament
mkvirtualenv openparliament-website --no-site-packages #this will create a virtual environment at ~/.virtualenvs/openparliament-website
workon openparliament
pip install django # even if you have django, install it in the virtual env
pip install mysql-python # mysql...
```

Edit the domain name for your website in `openparliament.nginx`.

Enable "openparliament" in `nginx` server:
```sh
# in development:
sudo ln -s /home/ubuntu/web/openparliament/apps/website/openparliament.dev.nginx /etc/nginx/sites-enabled/
# in production
sudo ln -s /home/ubuntu/web/openparliament/apps/website/openparliament.nginx /etc/nginx/sites-enabled/
```

And then to activate:
```sh
sudo service nginx restart
```

Enable & activate "openparliament" in the `uwsgi` server:
```sh
sudo ln -s /home/ubuntu/web/openparliament/apps/website/openparliament.uwsgi /etc/uwsgi/apps-enabled/openparliament.ini
sudo service uwsgi restart
```

**...да се допише...**

## Опресняване на направени промени

Докато сайта е още в разработка може да се изпълни:

```
sudo service uwsgi restart && sudo service nginx restart
```
