class Structure < ActiveRecord::Base
  enum kind: [:assembly, :party, :comittee, :t_comittee, :subcomittee, :delegation, :f_group]

  has_many :participations
  has_many :members, through: :participations

  scope :parties, -> { where(kind: "party") }
  scope :assemblies, -> { where(kind: "assembly") }
  scope :by_date, ->(date) {
    where("(start_date <= :d and end_date >= :d) or (start_date <= :d and end_date is NULL)", :d => date)
  }
  scope :ordered, -> { order("start_date") }

  def self.party_names
    Structure.where(:kind => "party").map(&:name)
  end

end
