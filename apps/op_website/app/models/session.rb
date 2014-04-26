class Session < ActiveRecord::Base
  has_many :votings

  def absent_votes
    absent = self.votings.order("voted_at").joins(:votes).where("votes.value" => "absent").count
    votings = self.votings.count
    absent.to_f/votings
  end

  #Voting.joins(:votes).where('votes.value' => "absent").group("session_id").count

end
