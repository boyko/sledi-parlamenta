require File.expand_path('../../../website/config/environment',  __FILE__)
require 'logger'

path = ARGV[0]
logger = Logger.new('downloader.log')

Session.assemblies.pluck(:date)[0..3].map do |d|
  d.strftime("%Y_%m_%d")
end.each do |date|
  (1..10).each do |part|
    url = "193.109.55.86/video/archive-#{date}_#{part}.mp4"
    res = `curl --head -s #{url}`
    if res.include? "HTTP/1.1 200 OK"
      `cd #{path}; curl -O #{url}`
    else
      logger.info "Video for date: #{date}, part: #{part} not found."
    end
    sleep rand(1..5)
  end
end

