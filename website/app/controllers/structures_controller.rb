class StructuresController < ApplicationController
  def index
    query = Structure.all
    search_query = structure_params[:q]
    kind = structure_params[:kind]
    query = query.search(search_query) unless search_query.blank?
    query = query.by_kind(kind) unless kind.blank?

    @structures = query.paginate(:page => structure_params[:page])
  end

  def show
    @structure = Structure.find(params[:id])
    @year = params[:year].blank? ? Date.today : Date.new(params[:year].to_i)
    @sessions = @structure.sessions.by_year(@year).group_by { |s| s.date }
  end

  private

  def structure_params
    params.permit(:q, :kind, :page)
  end
end
