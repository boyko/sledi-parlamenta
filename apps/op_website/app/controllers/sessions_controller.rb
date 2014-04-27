class SessionsController < ApplicationController
  def index
    @sessions = Session.all
  end

  def show
    @session = Session.find(params[:id])
  end

  def attendance
    data = Session.find(params[:session_id]).absent_count_by_voting
    render :json => data
  end

  def votes
    data = Session.find(params[:session_id]).votes_by_voting
    render :json => data
  end

end

