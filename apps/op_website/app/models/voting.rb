class Voting < ActiveRecord::Base
  belongs_to :session
  has_many :votes
  has_many :members, through: :votes

  def absent
    self.votes.where(value: "absent")
  end

  def absent_count
    self.absent.count
  end

  def votes_count
    self.votes.group("value").count
  end

  def by_party
    date = self.session.date
    self.members.joins(:structures)
    .where("(participations.start_date <= ? and participations.end_date >= ?) or participations.end_date is ?", date, date, nil)
    .where("structures.kind" => "party").group("structures.name", "votes.value").count
  end

end

