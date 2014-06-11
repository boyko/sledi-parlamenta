lock '3.2.1'

server 'parliament.obshtestvo.bg:2203', user: 'www-data', roles: %w(app web db)

set :application,     'parliament.obshtestvo.bg'
set :deploy_to,       '/var/www/parliament.obshtestvo.bg'
set :repo_url,        'https://github.com/obshtestvo/open-parliament.git'
set :linked_files,    %w(config/database.yml)
set :linked_dirs,     %w(bin log tmp/pids tmp/cache tmp/sockets vendor/bundle public/system)
set :keep_releases,   20
set :rails_env,       'production'
set :git_strategy,    Capistrano::GitSubfolderStrategy
set :git_subfolder,   '/website'
set :puma_threads,    [15, 15]
set :puma_workers,    3
set :puma_init_active_record, true
