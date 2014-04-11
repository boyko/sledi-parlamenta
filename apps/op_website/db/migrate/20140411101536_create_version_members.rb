class CreateVersionMembers < ActiveRecord::Migration
  def change
    create_table :version_members do |t|
      t.references :version, index: true
      t.references :member, index: true

      t.timestamps
    end
  end
end
