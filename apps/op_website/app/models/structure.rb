class Structure < ActiveRecord::Base
  has_many :participations
  has_many :members, through: :participations

  def self.party_names
    Structure.where(:kind => "party").map(&:name)
  end

  def self.parties
    Structure.where(:kind => "party")
  end

end
