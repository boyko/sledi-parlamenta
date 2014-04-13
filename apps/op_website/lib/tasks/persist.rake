require 'json'

data_path = "lib/assets/"

namespace :persist do

  # run this task when Members are persisted
  task :svv => :environment do
    File.open(data_path + "mp-votes.txt").each do |voting|
      voting = JSON.load voting
      member = Member.find_by_3_names voting['name']

      raise "No member with name #{voting['name']} found" if member.nil?

      session_date = voting['date'].to_date
      assembly_id = 0

      Assembly.all.each do |a|
        if a.start_date >= session_date and a.end_date <= session_date
          assembly_id = a.id
          break
        end
      end

      session = Session.where(date: session_date, assembly_id: assembly_id, url: voting['source']).first_or_create
      votes = []

      voting['votes'].each do |vote|
        voting = Voting.where({
          session: session,
          time: vote['time'].to_datetime,
          topic: vote['topic']
        }).first_or_create

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
