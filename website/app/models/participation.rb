class Participation < ActiveRecord::Base
  belongs_to :member
  belongs_to :structure

  scope :by_date, ->(date) {
    where("(start_date < :date and end_date > :date) or (start_date < :date and end_date is NULL)", :date => date)
  }

end
