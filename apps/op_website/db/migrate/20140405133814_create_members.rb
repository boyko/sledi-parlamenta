class CreateMembers < ActiveRecord::Migration
  def change
    create_table :members do |t|
      t.string :name
      t.date :birthday
      t.string :hometown
      t.string :profession
      t.text :bio
      t.references :party, index: true

      t.timestamps
    end
  end
end
