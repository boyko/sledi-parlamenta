class BillsController < ApplicationController

  def index
    @bills = Bill.paginate(:page => bills_params[:page])
  end

  def show
    @bill = Bill.find_by(id: bills_params[:id])
  end

  def bills_params
    params.permit(:id, :page)
  end

end

