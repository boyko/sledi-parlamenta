class CreateAggregateVotings < ActiveRecord::Migration
  def change
    create_table :aggregate_votings do |t|
      t.references :voting
      t.references :structure
      t.integer :yes
      t.integer :no
      t.integer :abstain
      t.integer :absent

      t.timestamps
    end

    Voting.non_registration.each do |v|

      date = v.session.date
      res = v.members.by_party.by_date(date).group("structure_id", "votes.value").count

      res.keys.map { |r| r[0] }.uniq.each do |party_id|

        AggregateVoting.create!({
          voting_id: v.id,
          structure_id: party_id,
          yes: res[[party_id, Vote.values[:yes]]].nil? ? Vote.values[:yes] : res[[party_id, Vote.values[:yes]]],
          no: res[[party_id, Vote.values[:no]]].nil? ? Vote.values[:no] : res[[party_id, Vote.values[:no]]],
          abstain: res[[party_id, Vote.values[:abstain]]].nil? ? Vote.values[:abstain] : res[[party_id, Vote.values[:abstain]]],
          absent: res[[party_id, Vote.values[:absent]]].nil? ? Vote.values[:absent] : res[[party_id, Vote.values[:absent]]],
        })

      end

    end

  end
end

