class Vote < ActiveRecord::Base
  belongs_to :voting
  belongs_to :member
end

