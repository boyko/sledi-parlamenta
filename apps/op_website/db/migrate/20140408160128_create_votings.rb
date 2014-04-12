class CreateVotings < ActiveRecord::Migration
  def change
    create_table :votings do |t|
      t.references :session, index: true
      t.references :version, index: true
      t.string :topic
      t.datetime :time
      t.string :result

      t.timestamps
    end
  end
end
