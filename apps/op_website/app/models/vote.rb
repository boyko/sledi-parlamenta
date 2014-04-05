class Vote < ActiveRecord::Base
  belongs_to :bill
  belongs_to :member
end

