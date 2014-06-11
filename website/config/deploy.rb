lock '3.2.1'

server 'parliament.obshtestvo.bg:2203', user: 'www-data', roles: %w(app web db)

set :application,     'parliament.obshtestvo.bg'
set :deploy_to,       '/var/www/parliament.obshtestvo.bg'
set :repo_url,        'https://github.com/obshtestvo/open-parliament.git'
set :linked_files,    %w(config/database.yml)
set :linked_dirs,     %w(bin log tmp/pids tmp/cache tmp/sockets vendor/bundle public/system)
set :keep_releases,   20
set :rails_env,       'production'
set :bundle_bins,     fetch(:bundle_bins, []) + %w(puma pumactl)
set :git_strategy,    Capistrano::GitSubfolderStrategy
set :git_subfolder,   '/website'

namespace :deploy do
  desc 'Restart the application'
  task :restart do
    on roles(:app), in: :sequence, wait: 5 do
      within current_path do
        puma_state_file = current_path.join('tmp/pids/puma.state')
        if test :test, '-f', puma_state_file
          execute :pumactl, '--state', puma_state_file, 'restart'
        end
      end
    end
  end

  after :publishing, :restart
end
