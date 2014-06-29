class Bill < ActiveRecord::Base
  has_and_belongs_to_many :members
  has_many :reviews
  has_many :committees, through: :reviews, foreign_key: :structure_id, source: :structure

  has_many :statuses
end
