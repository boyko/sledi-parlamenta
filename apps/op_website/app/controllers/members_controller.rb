class MembersController < ApplicationController
  def index
    party = params[:party]

    if party.nil?
      @members = Member.all
    else
      @members = Structure.find(party[:party_id]).members
    end
  end

  def show
    @member = Member.find(params[:id])
  end
end
