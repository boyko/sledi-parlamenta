class CreateVotes < ActiveRecord::Migration
  def change
    create_table :votes do |t|
      t.references :member, index: true
      t.references :voting, index: true
      t.integer :value

      t.timestamps
    end
  end
end
