lock '3.2.1'

set :application,     'parliament.obshtestvo.bg'
set :site_folder,     'website/'
set :deploy_to,       '/home/openparliament/parliament.obshtestvo.bg'
set :repo_url,        'https://github.com/obshtestvo/open-parliament.git'
set :linked_files,    %w(config/database.yml).map { |path| fetch(:site_folder) + path }
set :linked_dirs,     %w(bin log tmp/pids tmp/cache tmp/sockets vendor/bundle public/system).map { |path| fetch(:site_folder) + path }
set :keep_releases,   20
set :rails_env,       'production'
set :bundle_bins,     fetch(:bundle_bins, []) + %w(puma pumactl)
set :default_env,     {rails_relative_url_root: '/' + fetch(:site_folder)}

namespace :deploy do
  desc 'Restart the application'
  task :restart do
    on roles(:app), in: :sequence, wait: 5 do
      within current_path do
        execute 'pumactl', '--state', current_path.join("#{fetch(:site_folder)}tmp/pids/puma.state"), 'restart'
      end
    end
  end

  after :publishing, :restart
end
