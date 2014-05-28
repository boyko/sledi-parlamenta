require "json"
require 'logger'

path = ARGV[0]
logger = Logger.new('downloader.log')

$stdin.each_line do |line|
  ob = JSON.parse line
  date = ob["date"]
  session_path = path + "/" + date
  `mkdir -p #{session_path}`
  names = []
  ob["xls"].each do |url|
    names << name = session_path + "/" + url.split('/')[-1]

    next if File.exists?(name)

    `cd #{session_path}; curl -sO #{url}`
    sleep rand(1..5)
  end

  if names.length < 2
    logger.warn "Too few xls files: #{names.length} for date: #{date}"
  else
    p names
  end

end

