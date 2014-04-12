require 'json'

data_path = "lib/assets/"

namespace :persist do

  # run this task when Members are persisted
  task :svv => :environment do
    File.open(data_path + "mp-votes.txt").each do |voting|
      voting = JSON.load voting
      member = Member.find_by_3_names voting['name']

      raise "No member with name #{voting['name']} found" if member.nil?

      session = Session.find_by_date(voting['date'].to_date)
      votes = []

      voting['votes'].each do |v|
        voting = Voting.where({
          session: session,
          time: v['time'].to_datetime,
          topic: v['topic']
        }).first_or_create

        votes.push({
          member: member,
          voting: voting,
          value: v['val']
        })
      end

      Vote.create(votes)
    end
  end

end
