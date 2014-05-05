namespace :print do

  task :v_urls => :environment do
    Session.where("date >= ?", "2010-01-01").pluck(:date).map { |d|
      ["http://nsarch.unixsol.org/video/archive-" + d.strftime("%Y_%m_%d")+ "_1.mp4", "http://nsarch.unixsol.org/video/archive-" + d.strftime("%Y_%m_%d")+ "_2.mp4"]
    }.flatten.each do |url|
      puts url
    end
  end

end

