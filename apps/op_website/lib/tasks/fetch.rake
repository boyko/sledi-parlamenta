require 'json'
require "sqlite3"
require 'wombat'

def fetch_members_meta_data assembly_url_path
  puts "Fetching data about the members of parliament of the given assembly. URL path: #{assembly_url_path}"
  data = Wombat.crawl do
    base_url "http://www.parliament.bg"
    path assembly_url_path

    members "xpath=//div[@class='MProwD']", :iterator do
      first_name "xpath=strong[1]"
      middle_name "xpath=text()"
      last_name "xpath=strong[2]"
      position "xpath=following-sibling::div[1]//div[@class='MPinfo']//strong[1]", :html
      time "xpath=following-sibling::div[1]//div[@class='MPinfo']/text()[normalize-space()]"
      gov_site_id "xpath=following-sibling::div[1]//div[@class='MPinfo']//a/@href" do |e| e.split('/')[-1] end
    end
  end

  final = data['members'].map { |m|
    {
      "name" => "#{m['first_name']} #{m['middle_name']} #{m['last_name']}".mb_chars.titleize.to_s,
      "position" => m['position'],
      "time" => m['time'],
      "gov_site_id" => m['gov_site_id']
    }
  }

  puts "Fetching data about the members of parliament of the given assembly COMPLETED."
  return final
end

def fetch_member gov_site_id
  date_regex = /\d{1,2}\/\d{1,2}\/\d{4}/
  data = Wombat.crawl do
    base_url "http://www.parliament.bg"
    path "/bg/Mp/" + gov_site_id

    birthday "xpath=//ul[@class='frontList']//li[contains(., 'Дата на раждане : ')]" do |e|
      e.nil? ? e : e[date_regex]
    end
    hometown "xpath=//ul[@class='frontList']//li[contains(., 'Дата на раждане : ')]" do |e|
      e.nil? ? e : e.split(date_regex)[-1][1..-1]
    end
    party_id "xpath=//ul[@class='frontList']//li[contains(., 'Избран(а) с политическа сила: ')]" do |e|
      unless e.nil?
        party_dict = {
          # 42
          "ПП „ГЕРБ“"                                       =>  1,
          "КП „Коалиция за България“"                       =>  2,
          "ПП „Движение за права и свободи“"                =>  3,
          "ПП „Атака“"                                      =>  4,
          # 41
          "ГЕРБ"                                            =>  1,
          '"Коалиция за България"'                          =>  2,
          'ДПС "Движение за права и свободи"'               =>  3,
          'Партия "Атака"'                                  =>  4,
          '"Синята коалиция"'                               =>  5,
          '"Ред, законност и справедливост"'                =>  6,
          # 40
          '"Коалиция за България"'                          =>  2,
          '"Движение за права и свободи"'                   =>  3,
          'Коалиция "Атака"'                                =>  4,
          '"Национално движение Симеон Втори"'              =>  7,
          'Коалиция "Обединени Демократични Сили"'          =>  8,
          "Демократи за силна България"                     =>  9,
          'Коалиция "Български Народен Съюз"'               =>  10,
          # 39
          '"Коалиция за България"'                          =>  2,
          'ДПС (ДПС – Либерален съюз – Евророма)'           =>  3,
          '“Национално движение Симеон Втори”'              =>  7,
          '“Обединени демократични сили – СДС, Народен съюз: БЗНС-Народен съюз и Демократическа партия, БСДП, Национално ДПС”'  =>  8
        }
        party_str = e.gsub(/Избран\(а\) с политическа сила: /, "").gsub(/ \d+\.\d+%;/, '')
        puts party_dict[party_str]
        party_dict[party_str]
      end
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
  inner_data = fetch_member m['gov_site_id']
  persist_member m, inner_data
end

def fetch_members_inner_data_end_persist members
  puts "Initiated fetching of inner data for every parliament member."
  members_length = members.length
  count = 1

  all_gov_site_ids = Member.all.map(&:gov_site_id)

  members.each do |m|
    if all_gov_site_ids.include? m['gov_site_id'].to_i
      puts "Member #{m['name']} is already in DB (Perhaps she/he was part of another assembly). Skipping..."
    else
      fetch_member_and_persist m
    end

    puts "Progress: #{((count.to_f/members_length)*100).round}% | Current: #{m['name']}"
    count += 1
  end
end

namespace :fetch do

  namespace :members do

    # Populate DB with all MP's on gov. site.
    # MP's are fetched by iterating all the id's
    task :all => :environment do
      members = []
      assemblies_url_paths = ["/bg/archive/1/1/1", "/bg/archive/2/1/138", "/bg/archive/7/1/216", "/bg/mp"]
      assemblies_url_paths.each do |path|
        members.concat(fetch_members_meta_data path)
      end
      fetch_members_inner_data_end_persist members

      puts "Successfully fetched and persisted __ALL__ members into the database."
      puts "There are now #{Member.count} members into the database."
    end

    # This task should be run only once or perhaps never.
    # It populates the DB with the active members.
    task :active => :environment do
      members = fetch_members_meta_data "/bg/mp"
      fetch_members_inner_data_end_persist members

      puts "Successfully fetched and persisted __ACTIVE__ members into the database."
      puts "There are now #{Member.count} members into the database."
    end

    # this task should be run every day to update the DB
    task :new => :environment do
      members = fetch_members_meta_data "/bg/mp"
      puts "Checking if current members and database members match."

      # add new members
      members.each do |m|
        if Member.where(:gov_site_id => m["gov_site_id"]).blank?
          puts "New member found: #{m["name"]}. Fetching inner data from government website."
          fetch_member_and_persist m
        end
      end
      puts "New members added (if any)."

      # deactivate old members
      names = members.map { |m| m["name"] }
      Member.where(:status => "active").each do |m|
        unless names.include? m.name
          puts "Active member not found in government site: Mark #{m["name"]} inactive."
          m.status = "not active"
          m.save
        end
      end
      puts "Members' status updated."
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
