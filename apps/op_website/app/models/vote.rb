class Vote < ActiveRecord::Base
  belongs_to :voting
  belongs_to :member
  has_one :session, :through => :voting

  scope :absent, -> { where(value: "absent") }
  scope :absent_by_date, -> (date) { absent.joins(:session).where("sessions.date" => date) }
  scope :absent_by_date_grouped, -> (date) { absent_by_date.group("voting_id").count }
  scope :absent_by_date_grouped_by_time, -> (date) {
    absent_by_date
    .joins(:voting).group("votings.voted_at").count
  }

  def party
    self.member.party(self.voting.voted_at).structure.id
  end

  def voted_at
    self.voting.voted_at
  end

end

