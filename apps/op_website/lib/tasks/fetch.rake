require 'json'
require "sqlite3"

namespace :fetch do
  task :votes => :environment do
    puts "scraping data... this may take a while"
    members_str = %x{cat lib/tasks/example_data.txt}
    bc = Bill.count
    member_id = 0
    vote_dict = {
      yes: 0,
      no: 1,
      abstain: 2,
      absent: 3
    }
    members_str.each_line do |member|
      member_ob = JSON.load member
      #we don't have members table at this point - use dummy data
      #member = Member.find_by_name(member_ob.name)
      member_ob['votes'].each do |vote|
        #we don't have bills table at this point - use dummy data
        #bill = Bill.find_by_name(vote_ob.name)
        vote_final = {
          bill_id: (Random.rand() * bc).ceil,
          member_id: member_id,
          date: vote['time'],
          value: vote_dict[vote['val'].to_sym]
        }
        Vote.create(vote_final)
      end
      member_id += 1
    end
    puts "Proccess completed successfully."
  end

end


#while vote = gets
  #vote_ob = JSON.load vote
  #puts vote_ob['date']
#end
