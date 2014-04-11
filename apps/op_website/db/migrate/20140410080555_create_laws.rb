class CreateLaws < ActiveRecord::Migration
  def change
    create_table :laws do |t|
      t.reference :prev_law
      t.text :full_text
      t.reference :version

      t.timestamps
    end
  end
end
