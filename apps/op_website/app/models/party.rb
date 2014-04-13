class Party < ActiveRecord::Base
  belongs_to :assembly
  has_many :members
end
