class MembersController < ApplicationController
  def index
    party = params[:party]

    if party.nil? or party["party_id"] == ""
      @members = Member.paginate(:page => params[:page])
    else
      @members = Structure.find(party[:party_id]).members.paginate(:page => params[:page])
    end
  end

  def show
    @member = Member.find(params[:id])
  end
end
