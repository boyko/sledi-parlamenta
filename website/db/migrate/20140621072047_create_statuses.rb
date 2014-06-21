class CreateStatuses < ActiveRecord::Migration
  def change
    create_table :statuses do |t|
      t.references :bill, index: true
      t.integer :value
      t.date :date

      t.timestamps
    end
  end
end
