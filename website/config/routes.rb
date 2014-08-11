OpWebsite::Application.routes.draw do

  resources :sessions, :only => [:index, :show] do
    get 'votings'
    get 'prev'
    get 'next'
    get "aggregated"
    get "members"
  end

  resources :bills, :only => [:index, :show]

  resources :votings, :only => [:index, :show] do
    get 'by_name'
  end

  resources :structures, :only => [:index, :show]

  resources :members, :only => [:index, :show]

  match "faq" => "application#faq", :via => :get

  root :to => "members#index"

end
