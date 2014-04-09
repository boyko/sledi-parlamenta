class Member < ActiveRecord::Base
  belongs_to :party
  has_many :votes
end
