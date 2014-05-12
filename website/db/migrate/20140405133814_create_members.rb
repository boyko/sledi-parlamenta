class CreateMembers < ActiveRecord::Migration
  def change
    create_table :members do |t|
      t.string :first_name
      t.string :sir_name
      t.string :last_name
      t.string :gov_site_ids
      t.date :birthday
      t.string :hometown
      t.string :profession
      t.string :languages
      t.string :marital_status
      t.string :email
      t.string :website
      t.string :gender
      t.text :bio

      t.timestamps
    end
  end
end
