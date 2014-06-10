class Structure < ActiveRecord::Base
  enum kind: [:assembly, :party, :committee, :t_committee, :subcommittee, :delegation, :f_group]
  enum bg_kind: ["Народно събрание", "Партия", "Постоянна комисия", "Временна комисия", "Подкомисия", "Делегация", "Група за приятелство"]

  has_many :participations
  has_many :members, through: :participations
  has_many :sessions

  scope :parties, -> { where(kind: Structure.kinds[:party]) }
  scope :assemblies, -> { where(kind: Structure.kinds[:assembly]) }
  scope :by_date, ->(date) {
    where("(start_date <= :d and end_date >= :d) or (start_date <= :d and end_date is NULL)", :d => date)
  }
  scope :ordered, -> { order("start_date") }
  scope :by_kind, ->(kind) { where(kind: kind) }

  def self.party_names
    Structure.where(:kind => "party").map(&:name)
  end

  def self.search search_query
    Structure.where(Structure.arel_table[:name].matches("%#{search_query}%"))
  end

end
