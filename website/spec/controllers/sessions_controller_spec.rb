require 'rails_helper'

describe SessionsController do
  fixtures :sessions

  describe 'index' do
    it 'should render OK' do
      get :index
      expect(response).to be_successful
    end
  end

  describe 'show' do
    it 'should render OK' do
      get :show, id: Session.last.id
      expect(response).to be_successful
    end
  end
end
