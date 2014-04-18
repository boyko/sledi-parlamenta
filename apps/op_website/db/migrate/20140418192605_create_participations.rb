class CreateParticipations < ActiveRecord::Migration
  def change
    create_table :participations do |t|
      t.references :member, index: true
      t.references :structure, index: true
      t.string :position
      t.date :start_date
      t.date :end_date

      t.timestamps
    end
  end
end
