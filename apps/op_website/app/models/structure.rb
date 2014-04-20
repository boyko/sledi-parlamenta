class Structure < ActiveRecord::Base
  has_many :participations
  has_many :members, through: :participations

  def self.party_names
    Structure.where(:kind => "Парламентарни групи").map(&:name)
  end

  def self.parties
    Structure.where(:kind => "Парламентарни групи")
  end

end
