class CreateSessions < ActiveRecord::Migration
  def change
    create_table :sessions do |t|
      t.references :session, index: true
      t.string :url
      t.date :date

      t.timestamps
    end
  end
end
