class Structure < ActiveRecord::Base
  has_many :participations
  has_many :members, through: :participations

  scope :parties, -> { where(kind: "party") }
  scope :assemblies, -> { where(kind: "assembly") }
  scope :by_date, ->(date) {
    where("(start_date < ? and end_date > ?) or (start_date < ? and end_date is NULL)", date, date, date)
  }
  scope :ordered, -> { order("start_date") }

  def self.party_names
    Structure.where(:kind => "party").map(&:name)
  end

  # get all members of a structure in a given date
  def members_by_date date
    Member.all.joins(:participations).where("structure_id = ? and ((start_date <= ? and end_date >= ?) or end_date is ?)", self.id, date, date, nil)
  end

end
