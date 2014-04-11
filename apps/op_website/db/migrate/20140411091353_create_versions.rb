class CreateVersions < ActiveRecord::Migration
  def change
    create_table :versions do |t|
      t.references :proposed_by, index: true
      t.references :proposed_by_party, index: true
      t.references :prev_law, index: true
      t.string :title
      t.text :diff
      t.string :signature
      t.date :proposed_on
      t.date :accepted_on
      t.string :url

      t.timestamps
    end
  end
end
