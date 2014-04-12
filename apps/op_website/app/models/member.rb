class Member < ActiveRecord::Base
  belongs_to :party
  has_many :votes

  def self.find_by_3_names names
    names = names.split()
    Member.where(:first_name => names[0], :sir_name => names[1], :last_name => names[2]).first
  end
end
