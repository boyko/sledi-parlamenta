require File.expand_path('../../../website/config/environment',  __FILE__)
require 'json'
require 'logger'

logger = Logger.new('persister.log')

$stdin.each_line do |session_str|
  session = JSON.parse session_str

  date = session['date']
  structure_name = session['name']
  url = session['url']
  stenograph = session['stenograph']

  structure = Structure.find_by(name: structure_name)
  logger.error "Couldn't find structure with name #{structure_name}" if structure.nil?

  s = Session.create(date: date, structure: structure, stenograph: stenograph, url: url)
  puts "Session with id: #{s.id} successfully persisted [#{date}]"

end

