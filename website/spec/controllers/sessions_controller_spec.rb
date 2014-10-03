require 'rails_helper'

describe SessionsController do
  fixtures :structures, :sessions

  describe 'index' do
    it 'should render OK' do
      get :index
      expect(response).to be_successful
    end

    context 'with year filtering' do
      let(:session) { sessions(:old) }

      it 'should only show sessions from that year' do
        get :index, year: '2013'

        expect(assigns[:sessions]).to eql(
          session.date => [session]
        )
      end
    end

    context 'without year filtering' do
      let(:session) { sessions(:new) }

      it 'should only show sessions from the current year' do
        get :index

        expect(assigns[:sessions]).to eql(
          session.date => [session]
        )
      end
    end
  end

  describe 'show' do
    it 'should render OK' do
      get :show, id: Session.last.id
      expect(response).to be_successful
    end
  end
end
