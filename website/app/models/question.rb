class Question < ActiveRecord::Base
  belongs_to :questioner, :class_name => "Member", :foreign_key => "questioner_id"
  belongs_to :respondent, :class_name => "Member"
end
