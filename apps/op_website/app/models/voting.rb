class Voting < ActiveRecord::Base
  belongs_to :session
  has_many :votes

  def absent
    self.votes.where(value: "absent")
  end

  def absent_count
    self.absent.count
  end

  def votes_count
    self.votes.group("value").count
  end

end

