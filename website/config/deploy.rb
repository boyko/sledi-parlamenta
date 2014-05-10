lock '3.2.1'

set :application,     'parliament.obshtestvo.bg'
set :deploy_to,       '/home/openparliament/parliament.obshtestvo.bg'
set :repo_url,        'https://github.com/obshtestvo/open-parliament.git'
set :linked_files,    %w(config/database.yml)
set :linked_dirs,     %w(bin log tmp/pids tmp/cache tmp/sockets vendor/bundle public/system)
set :keep_releases,   20
set :rails_env,       'production'
set :bundle_bins,     fetch(:bundle_bins, []) + %w(puma pumactl)
set :git_strategy,    GitSubfolderStrategy
set :git_subfolder,   '/website'

namespace :deploy do
  desc 'Restart the application'
  task :restart do
    on roles(:app), in: :sequence, wait: 5 do
      within current_path do
        execute 'pumactl', '--state', current_path.join('tmp/pids/puma.state'), 'restart'
      end
    end
  end

  after :publishing, :restart
end
