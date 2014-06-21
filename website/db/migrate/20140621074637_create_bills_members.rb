class CreateBillsMembers < ActiveRecord::Migration
  def change
    create_join_table :bills, :members
  end
end
