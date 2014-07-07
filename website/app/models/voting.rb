class Voting < ActiveRecord::Base
  belongs_to :session
  has_many :votes
  has_many :members, through: :votes

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
    .group("structures.name")
    .group("members.id", "members.first_name" ,"members.last_name", "value").count
  end


  def self.search search_query
    Voting.where(Voting.arel_table[:topic].matches("%#{search_query}%"))
  end

end

