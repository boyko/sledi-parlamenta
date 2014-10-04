require 'rails_helper'

require 'timecop'

describe SessionsController do
  fixtures :structures, :sessions

  describe 'index' do
    before(:all) { Timecop.freeze(Date.parse('2014-10-10')) }
    after(:all) { Timecop.return }

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
      it 'should only show sessions from the current year' do
        get :index

        expect(assigns[:sessions]).to eql(
          sessions(:new_1).date => [sessions(:new_1)],
          sessions(:new_2).date => [sessions(:new_2)],
          sessions(:new_3).date => [sessions(:new_3)]
        )
      end
    end

    describe 'text search' do
      context 'without year param' do
        it 'retrieves the matching sessions from the current year' do
          get :index, query: 'братле'

          matched_sesion_1 = sessions(:new_2)
          matched_sesion_2 = sessions(:new_3)

          expect(assigns[:sessions]).to eql(
            matched_sesion_1.date => [matched_sesion_1],
            matched_sesion_2.date => [matched_sesion_2]
          )
        end
      end

      context 'with year param' do
        it 'retrieves the matching sessions from the given year' do
          get :index, query: 'братле', year: '2013'

          expect(assigns[:sessions]).to eql(
            sessions(:old).date => [sessions(:old)]
          )
        end
      end
    end
  end

  describe 'show' do
    it 'should render OK' do
      get :show, id: sessions(:new_1).id
      expect(response).to be_successful
    end
  end
end
