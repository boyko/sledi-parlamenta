class CreateStructures < ActiveRecord::Migration
  def change
    create_table :structures do |t|
      t.string :kind
      t.string :name
      t.string :abbreviation
      t.text :info
      t.string :website

      t.timestamps
    end
  end
end
