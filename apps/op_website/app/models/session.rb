class Session < ActiveRecord::Base
  belongs_to :assembly
  has_many :votings
end
