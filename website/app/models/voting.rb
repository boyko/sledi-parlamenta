class Voting < ActiveRecord::Base
  belongs_to :session
  has_many :votes
  has_many :members, through: :votes
  has_many :aggregate_votings

  accepts_nested_attributes_for :aggregate_votings

  scope :by_session, ->(session) { where(session: session) }
  scope :ordered, -> { order("voted_at") }
  scope :non_registration, -> { where.not(topic: "Регистрация") }

  def absent
    self.votes.where(value: "absent")
  end

  def absent_count
    self.absent.count
  end

  def votes_count
    self.votes.group("value").count
  end

  def by_name
    date = self.session.date

    self.members.by_party.by_date(date)
    .group("structures.abbreviation")
    .group("members.id", "members.first_name" ,"members.last_name", "value").order("structures.abbreviation")
    .count.keys
  end

  def self.search search_query
    where(Voting.arel_table[:topic].matches("%#{search_query}%"))
  end

  def self.filter_by_voting ag_votings
    vote_values = [:yes, :no, :abstain, :absent]
    filter = ag_votings.values.delete_if { |av| av[:structure_id].blank? }
    av = AggregateVoting.arel_table

    query = filter.map do |f|

      vote_values.map do |val|
        av[val].gteq(f[val.to_s])
      end.reduce(:and).and(av[:structure_id].eq(f["structure_id"]))

    end.reduce(:or)

    ids = Voting.joins(:aggregate_votings).where(query).group("votings.id").having("count(*)>#{filter.count-1}").count.keys
    where(id: ids)
  end

end

