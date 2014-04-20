class VotingsController < ApplicationController
  def index
    @votings = Voting.all
  end

  def show
    @voting = Voting.find(params[:id])
  end
end

