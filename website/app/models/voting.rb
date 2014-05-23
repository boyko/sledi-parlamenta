class Voting < ActiveRecord::Base
  belongs_to :session
  has_many :votes
  has_many :members, through: :votes

  scope :by_session, ->(session) { where(session: session) }
  scope :ordered, -> { order("voted_at") }

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

end

