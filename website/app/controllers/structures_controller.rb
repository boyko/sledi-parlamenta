class StructuresController < ApplicationController
  def index
    @structures = Structure.all
  end

  def show
    @structure = Structure.find(params[:id])
  end
end
