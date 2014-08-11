class Session < ActiveRecord::Base
  has_many :votings
  has_many :votes, :through => :votings
  has_many :aggregate_votings, :through => :votings
  has_many :members, :through => :structure
  belongs_to :structure

  scope :by_year, ->(year) { where("date >= ? and date <= ?", year.to_datetime.beginning_of_year, year.to_datetime.end_of_year) }
  scope :assemblies, -> { joins(:structure).where(structures: { kind: Structure.kinds[:assembly] }) }
  scope :committees, -> { joins(:structure).where(structures: { kind: Structure.kinds[:committee] }) }
  scope :t_committees, -> { joins(:structure).where(structures: { kind: Structure.kinds[:t_committee] }) }
  scope :subcommittees, -> { joins(:structure).where(structures: { kind: Structure.kinds[:subcommittee] }) }
  scope :by_structure_name, ->(name) { joins(:structure).where(structures: { name: name }) }

  def registration
    self.votings.find_by(topic: "Регистрация")
  end

  def prev
    sess = Session.arel_table
    structure_name = self.structure.name
    Session.by_structure_name(structure_name).where(sess[:date].lt(self.date)).order("date desc").first
  end

  def next
    sess = Session.arel_table
    structure_name = self.structure.name
    Session.by_structure_name(structure_name).where(sess[:date].gt(self.date)).order("date asc").first
  end

end
