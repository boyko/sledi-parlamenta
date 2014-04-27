class Session < ActiveRecord::Base
  has_many :votings
  has_many :votes, :through => :votings

  def absent_votes
    absent = self.votings.order("voted_at").joins(:votes).where("votes.value" => "absent").count
    votings = self.votings.count
    absent.to_f/votings
  end

  def absent
    self.votes.absent
  end

  def absent_count
    self.absent.count
  end

  def absent_count_by_voting
    data = self.absent.joins(:voting).group("votings.voted_at").count
    data.map { |d| [d[0].to_datetime.strftime('%H:%M'), d[1]] }
  end

  def votes_by_voting
    # The query may seems odd, but we can call 'joins' on #<ActiveRecord::Relation []>
    votes = Session.where(id: self.id).joins(:votes).group("votings.topic", "votes.value").count
            .map { |v| v.flatten }

    res = []
    words = ["absent", "abstain", "no", "yes"].reverse

    unique = votes.map { |v| v[0] }.uniq
    unique.each do |t|
      current = votes.select { |v| v[0] == t }.map { |v| v[1] }
      missing = words - current
      missing.each do |mw|
        idx = votes.index { |v| v[0] === t }
        votes.insert(idx+3, [t, mw, 0])
      end
    end

    words.each do |w|
      res.push({
        name: w,
        data: votes.select { |v| v[1] == w }.map { |v| v[2] }
      })
    end

    res
  end

end
