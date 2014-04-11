class CreateStructures < ActiveRecord::Migration
  def change
    create_table :structures do |t|
      t.string :name
      t.text :info
      t.kind :string
      t.boolean :continuous

      t.timestamps
    end
  end
end
