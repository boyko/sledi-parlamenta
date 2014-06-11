set :deploy_to, '/var/www/staging.parliament.obshtestvo.bg'

set :puma_threads, [4, 4]
set :puma_workers, 1
