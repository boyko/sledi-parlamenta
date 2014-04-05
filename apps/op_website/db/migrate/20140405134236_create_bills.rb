class CreateBills < ActiveRecord::Migration
  def change
    create_table :bills do |t|
      t.references :member, index: true
      t.references :party, index: true
      t.string :title
      t.text :content
      t.date :proposed_on
      t.date :accepted_on
      t.string :url

      t.timestamps
    end
  end
end
