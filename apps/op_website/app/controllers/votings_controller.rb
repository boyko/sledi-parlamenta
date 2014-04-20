class VotingsController < ApplicationController
  def show
    @voting = Voting.find(params[:id])
  end
end

