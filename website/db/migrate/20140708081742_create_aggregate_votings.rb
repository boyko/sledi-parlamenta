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

    votings = Voting.all.in_groups_of(500)
    votings[-1].compact!

    votings.each_with_index do |bulk, index|
      all = []

      bulk.each do |voting|

        sorted = {}
        voting.grouped.each do |key, value|
          sorted[key[0]] ||= []
          sorted[key[0]] << [key[1], value]
        end

        sorted.each do |party_id, votes_and_counts|

          ob = {}

          [:yes, :no, :abstain, :absent].each do |k|
            res = votes_and_counts.select { |v| v[0] == Vote.values[k] }
            ob[k] = res.empty? ? 0 : res[0][1]
          end

          ob[:voting_id] = voting.id
          ob[:structure_id] = party_id

          all.push ob
        end
      end

      transaction do
        AggregateVoting.create!(all)
      end

      p index
    end

  end
end

