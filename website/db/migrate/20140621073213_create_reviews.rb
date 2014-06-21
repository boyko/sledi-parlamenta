class CreateReviews < ActiveRecord::Migration
  def change
    create_table :reviews do |t|
      t.references :bill, index: true
      t.references :structure, index: true
      t.date :date
      t.text :report_content
      t.date :report_date
      t.boolean :leading

      t.timestamps
    end
  end
end
