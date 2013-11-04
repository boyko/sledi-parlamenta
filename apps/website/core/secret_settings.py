DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'openparliament',
        'USER': 'root',
        'PASSWORD': '12qw23we',
        'HOST': '',
        'PORT': '',
        'TEST_CHARSET': None,
        'TEST_COLLATION': None,
        'OPTIONS' : {
            'init_command': 'SET storage_engine=INNODB,character_set_connection=utf8,collation_connection=utf8_unicode_ci'
        }
    }
}

SECRET_KEY = 'ff!gdayf%s^@a4*13gds6l5+^b5i1w=_#e%fqi#gcy_&0qnug&'