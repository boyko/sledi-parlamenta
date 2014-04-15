class Member < ActiveRecord::Base
  belongs_to :party
  has_many :votes
  has_many :speeches

  def self.find_by_three_names names
    names = names.split
    Member.where(:first_name => names[0], :sir_name => names[1], :last_name => names[2]).first
  end

  def self.find_by_two_names names
    names = names.split.map { |n| n.mb_chars.upcase.to_s }
    Member.where(:first_name => names[0], :last_name => names[1]).first
  end
end
