require File.expand_path('../../../website/config/environment',  __FILE__)
require 'json'

$stdin.each_line do |session_str|
  session = JSON.parse session_str

  members = session['members'].map do |m|
    names = m.mb_chars.titleize.to_s
    Member.find_by_three_names names
  end

  date = session['date']

  # We must use find_or_create_by, because there is another script
  # that saves the stenograph and url and we don't know the which
  # one is executed first.
  s = Session.find_or_create_by(date: date)

  session['votings'].each do |voting|
    time = date + " " + voting['time']
    v = Voting.create(session: s, topic: voting['topic'], voted_at: time)

    voting['votes'].each_with_index do |vote, idx|
      Vote.create(member: members[idx], voting: v, value: Vote.values[vote.to_sym])
    end
  end

  puts "Votings for session with id: #{s.id} persisted [#{s.date}]"

end

