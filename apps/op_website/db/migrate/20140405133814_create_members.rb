class CreateMembers < ActiveRecord::Migration
  def change
    create_table :members do |t|
      t.string :name
      t.integer :gov_site_id
      t.date :birthday
      t.string :hometown
      t.string :profession
      t.string :position
      t.string :elected_from
      t.string :languages
      t.string :email
      t.string :website
      t.text :bio
      t.references :party, index: true

      t.timestamps
    end
  end
end
