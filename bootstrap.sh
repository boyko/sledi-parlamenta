#!/usr/bin/env bash

CURRENT_DIR=$PWD
VAGRANT_DIR=/vagrant
PROJECT_NAME=recycle
DB_NAME=$PROJECT_NAME

sudo apt-get update -y

## usability (can be omitted)
sudo apt-get update -y
touch $HOME/.hushlogin
sudo apt-get install expect curl zsh fortune cowsay htop git build-essential -y
wget https://github.com/robbyrussell/oh-my-zsh/raw/master/tools/install.sh -O - | zsh
sudo mkdir -p $HOME/.oh-my-zsh/custom/plugins
git clone git://github.com/zsh-users/zsh-syntax-highlighting.git  $HOME/.oh-my-zsh/custom/plugins/zsh-syntax-highlighting
sudo chsh -s `which zsh` vagrant
sed -i.bak 's/^plugins=(.*/plugins=(git zsh-syntax-highlighting)/' $HOME/.zshrc

# ruby stuff
\curl -sSL https://get.rvm.io | bash -s stable --ruby=2.1.1
sudo apt-get install libsqlite3-dev -y
cd $VAGRANT_DIR/apps/op_website
source $HOME/.rvm/scripts/rvm
rvm use 2
bundle install
rake db:migrate
rake db:seed
cd $CURRENT_DIR

# php
sudo apt-get install php5 -y
curl -sS https://getcomposer.org/installer | php
sudo mv composer.phar /usr/local/bin/composer


# nodejs stuff
wget -qO- https://raw.github.com/creationix/nvm/v0.4.0/install.sh | sh
source $HOME/.nvm/nvm.sh
nvm install 0.10
nvm alias default 0.10
sudo apt-get install libfontconfig libfontconfig-dev libfreetype6-dev
npm install phantomjs -g

# fixtures
(cd $VAGRANT_DIR/apps/op_website/db/ && wget -qO - https://dl.dropboxusercontent.com/u/4296335/db.dump.gz | zcat | sqlite3 development.sqlite3)

# run server
rails s -d

# build the rest of the crawlers
bash $VAGRANT_DIR/build.sh

# always run server
echo "start on vagrant-mounted

script
  (cd /vagrant/apps/op_website/ && rails s -d)
end script" | sudo tee /etc/init/rails-dev-server.conf
