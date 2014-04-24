class Structure < ActiveRecord::Base
  has_many :participations
  has_many :members, through: :participations

  def self.party_names
    Structure.where(:kind => "party").map(&:name)
  end

  def self.parties
    Structure.where(:kind => "party")
  end

  def self.parties_by_date date = nil
    Structure.where("structures.kind == ?", "party")
    .joins(:participations).where("(participations.start_date <= ? and participations.end_date >= ?) or end_date is ?", date, date, nil).group("name")
  end

  # get all members of a structure in a given date
  def members_by_date date
    Member.all.joins(:participations).where("structure_id = ? and ((start_date <= ? and end_date >= ?) or end_date is ?)", self.id, date, date, nil)
  end

end
