class Status < ActiveRecord::Base
  enum value: [:entered, :submitted, :withdrawn]

  belongs_to :bill
end
