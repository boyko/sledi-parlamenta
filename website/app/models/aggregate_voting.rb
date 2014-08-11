class AggregateVoting < ActiveRecord::Base
  belongs_to :voting

  scope :ordered_by_time, -> { order("votings.voted_at") }
  scope :ordered_by_structure_id, -> { order("structure_id") }

end
