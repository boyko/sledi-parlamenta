class CreateLaws < ActiveRecord::Migration
  def change
    create_table :laws do |t|
      t.references :prev_law
      t.text :full_text
      t.references :version

      t.timestamps
    end
  end
end
