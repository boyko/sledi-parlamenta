require File.expand_path('../../../website/config/environment',  __FILE__)
require 'json'

$stdin.each_line do |session_str|
  session = JSON.parse session_str

  date = session['date']

  a = Structure.assemblies.by_date(date)

  # We must use find_or_create_by, because there is another script
  # that saves the stenograph and url and we don't know the which
  # one is executed first.
  s = Session.find_or_create_by(date: date)
  s.assembly = a
  s.stenograph = session['stenograph']
  s.url = session['url']
  s.save

end

