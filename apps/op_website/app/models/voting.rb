class Voting < ActiveRecord::Base
  belongs_to :session
  has_many :votes
end
