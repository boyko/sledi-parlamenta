class CreateBills < ActiveRecord::Migration
  def change
    create_table :bills do |t|
      t.text :name
      t.integer :gov_id
      t.text :content
      t.string :session
      t.string :signature
      t.string :file_author
      t.string :file_editor
      t.string :file_company

      t.timestamps
    end
  end
end
