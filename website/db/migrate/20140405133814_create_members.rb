class CreateMembers < ActiveRecord::Migration
  def change
    create_table :members do |t|
      t.string :first_name
      t.string :sir_name
      t.string :last_name
      t.string :gov_site_id
      t.date :birthday
      t.string :hometown
      t.string :profession
      t.string :languages
      t.string :marital_status
      t.string :constituency
      t.string :email
      t.string :website
      t.string :position
      t.boolean :non_affiliated
      t.string :status
      t.string :gender
      t.boolean :council_ministers
      t.string :cm_position
      t.text :bio

      t.timestamps
    end
  end
end
