class Vote < ActiveRecord::Base
  belongs_to :voting
  belongs_to :member

  def party
    self.member.party(self.voting.voted_at).structure.id
  end
end

