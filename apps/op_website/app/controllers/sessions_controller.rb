class SessionsController < ApplicationController
  def index
    @year = params[:year].blank? ? Date.today : Date.new(params[:year].to_i)
    @sessions = Session.by_year(@year).group_by { |t| t.date.beginning_of_month }
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

end

