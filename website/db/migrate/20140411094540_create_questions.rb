class CreateQuestions < ActiveRecord::Migration
  def change
    create_table :questions do |t|
      t.string :signature
      t.string :gov_site_id
      t.string :status
      t.string :topic
      t.text :content
      t.text :answer
      t.date :asked
      t.date :replied

      t.references :questioner, index: true
      t.references :respondent, index: true

      t.timestamps
    end
  end
end
