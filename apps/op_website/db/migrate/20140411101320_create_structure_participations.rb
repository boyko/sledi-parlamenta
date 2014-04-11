class CreateStructureParticipations < ActiveRecord::Migration
  def change
    create_table :structure_participations do |t|
      t.references :member, index: true
      t.references :structure, index: true
      t.string :assembly_references
      t.date :start_date
      t.date :end_date

      t.timestamps
    end
  end
end
