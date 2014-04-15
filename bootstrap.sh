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
sed -i.bak 's/^plugins=(.*/plugins=(git django python pip virtualenvwrapper emoji-clock zsh-syntax-highlighting bower)/' $HOME/.zshrc

# ruby stuff
\curl -sSL https://get.rvm.io | bash -s stable --ruby=2.1.1
sudo apt-get install libsqlite3-dev
cd apps/op_website
bundle install
rake db:migrate
rake db:seed
rails s -d
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
sudo apt-get install freetype-devel fontconfig-devel
npm install phantomjs -g

# build the rest of the crawlers
bash $VAGRANT_DIR/build.sh
#
## settings
#if [ ! -f "$VAGRANT_DIR/server/settings_app.py" ]; then
#    cp $VAGRANT_DIR/server/settings_app.py.vagrant-sample $VAGRANT_DIR/server/settings_app.py
#fi
#