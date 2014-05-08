class MembersController < ApplicationController
  def index

    query = Member.all
    query = query.search(member_params[:q])

    ids = member_params.slice(:party_id, :assembly_id).values.delete_if { |v| v.blank? }.map { |v| v.to_i }
    query = query.create_joins ids
    query = query.order(member_params[:order])

    @members = query.paginate(:page => member_params[:page])
  end

  def show
    @member = Member.find(params[:id])
  end

  private

  def member_params
    params.slice(:q, :order, :party_id, :assembly_id, :page)
  end
end
