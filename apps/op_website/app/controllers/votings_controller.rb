class VotingsController < ApplicationController
  def index
    @votings = Voting.all
  end

  def show
    @voting = Voting.find(params[:id])
  end

  def by_party
    data = Voting.find(params[:voting_id]).by_party
    render :json => prepare_data(data)
  end

end

