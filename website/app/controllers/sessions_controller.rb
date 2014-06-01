class SessionsController < ApplicationController
  def index
    @year = params[:year].blank? ? Date.today : Date.new(params[:year].to_i)
    @sessions = Session.by_year(@year).group_by { |s| s.date }
  end

  def show
    @session = Session.find(params[:id])
  end

  def attendance
    data = Session.find(params[:session_id]).absent_count_by_voting
    render :json => data
  end

  def votings
    data = Session.find(params[:session_id]).votes_by_voting
    render :json => prepare_data(data)
  end

  def prev
    current_session = Session.find(params[:session_id])
    redirect_to session_url(current_session.prev)
  end

  def next
    current_session = Session.find(params[:session_id])
    redirect_to session_url(current_session.next)
  end

end

