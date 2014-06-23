class Status < ActiveRecord::Base
  #enum value: [:entered, :submitted_fr, :accepted_fr, :withdrawn_fr, :submitted_sc, :accepted_sc, :withdrawn_sc]

  belongs_to :bill
end
