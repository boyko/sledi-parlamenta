class CreateStructures < ActiveRecord::Migration
  def change
    create_table :structures do |t|
      t.string :name
      t.string :kind
      t.text :info
      t.string :address
      t.string :email
      t.string :phone
      t.boolean :active
      t.string :website
      t.string :gov_url

      t.timestamps
    end
  end
end
