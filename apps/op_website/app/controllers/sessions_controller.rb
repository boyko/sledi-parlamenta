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

  def votings
    data = Session.find(params[:session_id]).votes_by_voting
    render :json => prepare_data(data)
  end

  private

  def prepare_data records
    votes = records.map { |v| v.flatten }
    res = []
    words = ["absent", "abstain", "no", "yes"].reverse

    unique = votes.map { |v| v[0] }.uniq
    unique.each do |t|
      current = votes.select { |v| v[0] == t }.map { |v| v[1] }
      missing = words - current
      missing.each do |mw|
        idx = votes.index { |v| v[0] === t }
        votes.insert(idx+3, [t, mw, 0])
      end
    end

    words.each do |w|
      res.push({
        name: w,
        data: votes.select { |v| v[1] == w }.map { |v| v[2] }
      })
    end

    res
  end

end

