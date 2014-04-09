class CreateVotings < ActiveRecord::Migration
  def change
    create_table :votings do |t|
      t.references :session, index: true
      t.string :title
      t.datetime :date

      t.timestamps
    end
  end
end
