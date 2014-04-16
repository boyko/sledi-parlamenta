class Question < ActiveRecord::Base
  belongs_to :questioner, :class_name => "Member"
  belongs_to :respondent, :class_name => "Member"
end
