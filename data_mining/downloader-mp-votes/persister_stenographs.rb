require File.expand_path('../../../website/config/environment',  __FILE__)
require 'json'

STDIN.read.split("\n").each do |session_str|
  session = JSON.load session_str

  # We must use first_or_create, because there is another script
  # that saves the stenograph and url and we don't know the which
  # one executed first.
  s = Session.first_or_create(date: session['date'])
  s.stenograph = session['stenograph']
  s.url = session['url']
  s.save

end

