require File.expand_path('../../../website/config/environment',  __FILE__)
require 'json'

mapper = {
  "+" => :yes,
  "-" => :no,
  "=" => :abstain,
  "0" => :absent,
  "О" => :registered,
  "П" => :manually_registered,
  "Р" => :not_registered
}

STDIN.read.split("\n").each do |session_str|
  session = JSON.load session_str

  members = session['members'].map do |m|
    names = m.mb_chars.titleize.to_s
    Member.find_by_three_names names
  end

  # We must use first_or_create, because there is another script
  # that saves the stenograph and url and we don't know the which
  # one executed first.
  s = Session.first_or_create(date: session['date'])

  session['votings'].each do |voting|
    v = Voting.create(session: s, topic: voting['topic'])

    voting['votes'].each_with_index do |vote, idx|
      Vote.create(member: members[idx], voting: v, value: Vote.values[mapper[vote]])
    end
  end

end

