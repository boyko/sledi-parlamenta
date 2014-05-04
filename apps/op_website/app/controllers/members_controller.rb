class MembersController < ApplicationController
  def index

    query = Member.all
    query = query.search(params[:q])

    ids = params.slice(:party_id, :assembly_id).values.delete_if { |v| v.blank? }.map { |v| v.to_i }
    query = query.create_joins ids

    @members = query.paginate(:page => params[:page])
  end

  def show
    @member = Member.find(params[:id])
  end
end
