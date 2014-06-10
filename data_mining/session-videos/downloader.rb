require File.expand_path('../../../website/config/environment',  __FILE__)
require 'logger'
require 'trollop'
require 'json'

logger = Logger.new('downloader.log')

opts = Trollop::options do
  opt :path, "Specify path.", :type => String, :required => true
  opt :interval, "Specify an open interval. If interval is not specified, all videos are downloaded.", :default => "[]", :type => String
end

path = opts[:path]

interval = JSON.load opts[:interval]
sess = Session.arel_table

if interval.empty?
  sessions = Session.assemblies.where.not(sess[:date].lt("2009-12-30")).pluck(:date)
else
  sessions = Session.assemblies.where.not(sess[:date].lt("2009-12-30")).where(sess[:date].gt(interval[0])).where(sess[:date].lt(interval[1]))
  .pluck(:date)
end

sessions.map do |d|
  d.strftime("%Y_%m_%d")
end.each do |date|
  (1..10).each do |part|
    url = "193.109.55.86/video/archive-#{date}_#{part}.mp4"
    res = `curl --head -s #{url}`
    if res.include? "HTTP/1.1 200 OK"
      `cd #{path}; curl -O #{url}`
      puts "Video for date: #{date}, part: #{part} successfully downloaded."
    else
      logger.info "Video for date: #{date}, part: #{part} not found."
    end
    sleep rand(1..5)
  end
end
