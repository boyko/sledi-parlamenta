require 'json'
require "sqlite3"
require 'wombat'

namespace :fetch do
  task :members => :environment do
    date_regex = /\d{1,2}\/\d{1,2}\/\d{4}/
    party_dict = {
      "ПП „ГЕРБ“"                         =>  1,
      "КП „Коалиция за България“"         =>  2,
      "ПП „Движение за права и свободи“"  =>  3,
      "ПП „Атака“"                        =>  4
    }
    data = Wombat.crawl do
      base_url "http://www.parliament.bg"
      path "/bg/Mp"

      members "xpath=//div[@class='MProwD']", :iterator do
        first_name "xpath=strong[1]"
        middle_name "xpath=text()"
        last_name "xpath=strong[2]"
        member "xpath=following-sibling::div[1]//div[@class='MPinfo']//strong[1]", :html
        time "xpath=following-sibling::div[1]//div[@class='MPinfo']/text()[normalize-space()]"
        gov_site_id "xpath=following-sibling::div[1]//div[@class='MPinfo']//a/@href" do |e| e.split('/')[-1] end
      end
    end

    res = []
    count = 0
    data['members'].each do |m|
      count += 1
      if count == 3
        break
      end
      inner_data = Wombat.crawl do
        base_url "http://www.parliament.bg"
        path "/bg/Mp/" + m['gov_site_id']
        birthday "xpath=//ul[@class='frontList']//li[contains(., 'Дата на раждане : ')]" do |e|
          e[date_regex]
        end
        hometown "xpath=//ul[@class='frontList']//li[contains(., 'Дата на раждане : ')]" do |e|
          e.split(date_regex)[-1][1..-1]
        end
        party "xpath=//ul[@class='frontList']//li[contains(., 'Избран(а) с политическа сила: ')]" do |e|
          e.nil? ? e : e.gsub(/Избран\(а\) с политическа сила: /, "").split("“")[0] + "“"
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
      puts (count/240*100).to_s + "%"
      PP.pp inner_data
      final = {
        name:  (m['first_name'] + " " + m['middle_name'] + " " + m['last_name']).mb_chars.titleize.to_s,
        gov_site_id: m['gov_site_id'],
        birthday: inner_data['birthday'],
        hometown: inner_data['hometown'],
        party_id: party_dict[inner_data['party']],
        profession: inner_data['profession'],
        languages: inner_data['languages'],
        elected_from: inner_data['elected_from'],
        email: inner_data['email'],
        website: inner_data['website'],
        position: inner_data['poitions']
      }
      PP.pp final

      Member.create(final)
    end

    puts "done."
  end

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
