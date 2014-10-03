class SessionsController < ApplicationController
  def index
    @year = sessions_params[:year].blank? ? Date.today : Date.new(sessions_params[:year].to_i)

    @sessions = Session.assemblies.by_year(@year).group_by(&:date)
  end

  def show
    @session = Session.find(sessions_params[:id])
    @votings = @session.votings
    if @votings.count == 0
      flash.now[:notice] = "Не бяха намерени гласувания за тази сесия."
    end
  end

  def attendance
    data = Session.find(sessions_params[:session_id]).absent_count_by_voting
    render :json => data
  end

  def votings
    s = Session.find(sessions_params[:session_id])
    render :json => s.votings.ordered.pluck(:id, :topic, :voted_at)
  end

  def prev
    current_session = Session.find(sessions_params[:session_id])
    redirect_to session_url(current_session.prev)
  end

  def next
    current_session = Session.find(sessions_params[:session_id])
    redirect_to session_url(current_session.next)
  end

  def aggregated
    data = AggregateVoting.joins(:voting).where(votings: { session_id: sessions_params[:session_id] })
    .ordered_by_time.ordered_by_structure_id.pluck(:voting_id, :structure_id, :yes, :no, :abstain, :absent)
    .group_by { |av| av[0] }

    render :json => data
  end

  def members
    members = Member.joins(:votings).where("session_id = 59").uniq.pluck(:id, :first_name, :last_name)
    render :json => members
  end

  private

  def sessions_params
    params.slice(:id, :session_id, :year)
  end
end
