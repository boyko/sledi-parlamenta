class CreateSpeeches < ActiveRecord::Migration
  def change
    create_table :speeches do |t|
      t.string :topic
      t.date :date
      t.string :kind

      t.references :member

      t.timestamps
    end
  end
end
