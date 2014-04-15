require 'json'

data_path = "lib/assets/"

namespace :persist do

  # run this task when Members are persisted
  task :svv => :environment do
    File.open(data_path + "mp-votes.json").each do |voting|
      voting = JSON.load voting
      member = Member.find_by_three_names voting['name']

      raise "No member with name #{voting['name']} found" if member.nil?

      session_date = voting['date'].to_date

      assembly = Assembly.where("(start_date < ? and end_date > ?) or end_date is ?", session_date, session_date, nil).first
      session = Session.where(date: session_date, assembly: assembly, url: voting['source']).first_or_create
      votes = []

      voting['votes'].each do |vote|
        voting = Voting.find_or_create_by({
          session: session,
          voted_at: Time.zone.parse(vote['time']),
          topic: vote['topic']
        })

        votes.push({
          member: member,
          voting: voting,
          value: vote['val']
        })
      end

      Vote.create(votes)
    end
  end

end
