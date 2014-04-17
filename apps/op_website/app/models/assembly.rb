class Assembly < ActiveRecord::Base
  has_many :sessions
  has_many :structures
end
