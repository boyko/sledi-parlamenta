class VersionComittee < ActiveRecord::Base
  belongs_to :version
  belongs_to :member
end
