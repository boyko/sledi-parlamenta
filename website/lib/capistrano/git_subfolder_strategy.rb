require 'capistrano/git'

module Capistrano
  module GitSubfolderStrategy
    include Capistrano::Git::DefaultStrategy

    def release
      super

      full_repo_contents_folder = context.releases_path + "#{context.release_timestamp}-full"
      subfolder_to_deploy = File.join(full_repo_contents_folder, fetch(:git_subfolder))

      context.execute :mv, release_path, full_repo_contents_folder
      context.execute :mv, subfolder_to_deploy, release_path
      context.execute :rm, '-rf', full_repo_contents_folder
    end
  end
end
