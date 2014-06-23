require "json"
require 'logger'

path = ARGV[0]
logger = Logger.new('../log/bills/downloader.log')

$stdin.each_line do |line|
  ob = JSON.parse line
  url = ob['rtf']
  date = ob['date']
  signature = ob['signature']
  filepath = File.join(path, signature + ".rtf")
  if url.nil?
    logger.warn "rft file not found for bill with id #{ob['gov_id']}"
    puts "rft file not found for bill with id #{ob['gov_id']}"
    next
  elsif File.exists?(filepath)
    logger.info "rft file already exists for bill with id #{ob['gov_id']}"
    puts "rft file already exists for bill with id #{ob['gov_id']}"
    next
  else
    `cd #{path}; curl -sO #{url}`
    p "File with signature: #{signature} and date: #{date} persisted in #{path}"
    sleep rand(1..5)
  end

end

