class Review < ActiveRecord::Base
  belongs_to :bill
  belongs_to :structure
end
