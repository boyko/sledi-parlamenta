require 'json'
require "sqlite3"
require 'wombat'

def fetch_members
  puts "Fetching data about the current members of parliament."
  data = Wombat.crawl do
    base_url "http://www.parliament.bg"
    path "/bg/Mp"

    members "xpath=//div[@class='MProwD']", :iterator do
      first_name "xpath=strong[1]"
      middle_name "xpath=text()"
      last_name "xpath=strong[2]"
      position "xpath=following-sibling::div[1]//div[@class='MPinfo']//strong[1]", :html
      time "xpath=following-sibling::div[1]//div[@class='MPinfo']/text()[normalize-space()]"
      gov_site_id "xpath=following-sibling::div[1]//div[@class='MPinfo']//a/@href" do |e| e.split('/')[-1] end
    end
  end

  puts "Fetching data about the current members of parliament COMPLETED."
  final = data['members'].map { |m|
    {
      "name" => (m['first_name'] + " " + m['middle_name'] + " " + m['last_name']).mb_chars.titleize.to_s,
      "position" => m['position'],
      "time" => m['time'],
      "gov_site_id" => m['gov_site_id']
    }
  }
  return final
end

# m is a hash with member metadata
def fetch_member m
  date_regex = /\d{1,2}\/\d{1,2}\/\d{4}/
  data = Wombat.crawl do
    base_url "http://www.parliament.bg"
    path "/bg/Mp/" + m["gov_site_id"]

    birthday "xpath=//ul[@class='frontList']//li[contains(., 'Дата на раждане : ')]" do |e|
      e.nil? ? e : e[date_regex]
    end
    hometown "xpath=//ul[@class='frontList']//li[contains(., 'Дата на раждане : ')]" do |e|
      e.nil? ? e : e.split(date_regex)[-1][1..-1]
    end
    party_id "xpath=//ul[@class='frontList']//li[contains(., 'Избран(а) с политическа сила: ')]" do |e|
      party_dict = {
        "ПП „ГЕРБ“"                         =>  1,
        "КП „Коалиция за България“"         =>  2,
        "ПП „Движение за права и свободи“"  =>  3,
        "ПП „Атака“"                        =>  4
      }
      e.nil? ? e : party_dict[e.gsub(/Избран\(а\) с политическа сила: /, "").split("“")[0] + "“"]
    end
    profession "xpath=//ul[@class='frontList']//li[contains(., 'Професия: ')]" do |e|
      e.nil? ? e : e.gsub(/Професия: /, "").chop
    end
    languages "xpath=//ul[@class='frontList']//li[contains(., 'Езици: ')]" do |e|
      e.nil? ? e : e.gsub(/Езици: /, "").gsub(/;/, ", ").chop.chop
    end
    elected_from "xpath=//ul[@class='frontList']//li[contains(., 'Изборен район: ')]" do |e|
      e.nil? ? e : e.gsub(/Изборен район: /, "").chop
    end
    email "xpath=//ul[@class='frontList']//li[contains(., 'E-mail: ')]//a"
    website "xpath=//ul[@class='frontList']//li[contains(., 'Интернет сайт: ')]//a/@href"
  end
  return data
end

def persist_member meta_data, inner_data
  member = meta_data.merge(inner_data)
  Member.create(member)
end

def fetch_member_and_persist m
  inner_data = fetch_member m
  persist_member m, inner_data
end

namespace :fetch do

  namespace :members do

    # this task should be run only once. The goal is to populate the DB
    # with the active members.
    task :active => :environment do
      members = fetch_members

      puts "Initiated fetching of data of every active parliament member."
      count = 1

      members.each do |m|
        fetch_member_and_persist m

        puts "Progress: #{((count.to_f/240)*100).round}% | Current: #{m['name']}"
        count += 1
      end

      puts "Successfully fetched and persisted members into the database."
      puts "There are now #{Member.count} members into the database."
    end

    # this task should be run every day to update the DB
    task :new => :environment do
      members = fetch_members
      puts "Checking if current members and database members match."

      # add new members
      members.each do |m|
        if Member.where(:gov_site_id => m["gov_site_id"]).blank?
          puts "New member found: #{m["name"]}. Fetching inner data from government website."
          fetch_member_and_persist m
        end
      end

      # deactivate old members
      names = members.map { |m| m["name"] }
      Member.where(:status => "active").each do |m|
        unless names.include? m.name
          puts "Active member not found in government site: Mark #{m["name"]} inactive."
          m.status = "not active"
          m.save
        end
      end

      puts "Operation completed."
    end

  end

  task :votes => :environment do
    puts "scraping data... this may take a while"
    # FIXME this should be a path to the script mp-votes
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
