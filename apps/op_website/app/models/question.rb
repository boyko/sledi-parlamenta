class Question < ActiveRecord::Base
  belongs_to :questioner
  belongs_to :respondent
end
