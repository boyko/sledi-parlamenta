class Structure < ActiveRecord::Base
  has_many :participations
  has_many :members, through: :participations

  def self.party_names
    Structure.where(:kind => "party").map(&:name)
  end

  def self.parties date = nil
    if date.nil?
      Structure.where(:kind => "party")
    else
      Structure.where("structures.kind == ?", "party")
      .joins(:participations).where("(participations.start_date <= ? and participations.end_date >= ?) or end_date is ?", date, date, nil).group("name")
    end
  end

end
