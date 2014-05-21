class Vote < ActiveRecord::Base
  enum value: [:yes, :no, :abstain, :absent, :registered, :not_registered, :manually_registered]

  belongs_to :voting
  belongs_to :member
  has_one :session, :through => :voting

  scope :absent, -> { where(value: "absent") }
  scope :yes, -> { where(value: "yes") }
  scope :no, -> { where(value: "no") }
  scope :abstain, -> { where(value: "abstain") }
  scope :by_date, ->(date) { joins(:session).where("sessions.date" => date) }
  scope :by_voting, ->(voting) { where(voting: voting) }

  def party
    self.member.party(self.voting.voted_at).structure.id
  end

  def voted_at
    self.voting.voted_at
  end

end

