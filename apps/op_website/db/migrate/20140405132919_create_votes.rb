class CreateVotes < ActiveRecord::Migration
  def change
    create_table :votes do |t|
      t.references :bill, index: true
      t.references :member, index: true
      t.datetime :date
      t.integer :value

      t.timestamps
    end
  end
end
