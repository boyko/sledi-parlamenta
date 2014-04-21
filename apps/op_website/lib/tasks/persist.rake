require 'json'

#data_path = "lib/assets/"

namespace :persist do

  # Persist members, question, speeches
  task :msqs => :environment do

    members_str = %x{cat directory/to/mp-info.json}
    members_str.each_line do |member|
      member_ob = JSON.load member

      # find member - this will merge profiles
      member = Member.find_by_names_and_bd member_ob['first_name'], member_ob['sir_name'], member_ob['last_name'], member_ob['date_of_birth']

      member_ob['structures'].each do |s|

        type = case s['type']
          when "Членове на Народно събрание" then "assembly"
          when "Парламентарни групи" then "party"
          when "Постоянни парламентарни комисии" then "comittee"
          when "Временни парламентарни комисии" then "t_comittee"
          when "Парламентарни подкомисии" then "subcomittee"
          when "Парламентарни делегации" then "delegation"
          when "Групи за приятелство" then "f_group"
          else "Unknown type"
        end

        name = s['name']
        name = name.gsub("Парламентарна група на ", "").gsub("Парламентарен съюз на ", "").gsub("Парламентарна група ", "").gsub("&quot;", "")

        name = name
          .gsub("39-то Народно Събрание", "39-то Народно събрание")
          .gsub("41-о Народно събрание", "41-во Народно събрание")

        name = name.mb_chars.downcase.capitalize.to_s if type == "comittee"

        name = name.gsub("\n", "").gsub("\r\n", "")

        structure = Structure.find_or_create_by(name: name, kind: type)
        Participation.create(member: member, structure: structure, position: s['position'], start_date: s['from'], end_date: s['to'])
      end

      # assign other information
      member.gov_site_id = member_ob['gov_site_id']
      member.hometown = member_ob['place_of_birth']
      member.profession = member_ob['professions'].join(', ') unless member_ob['professions'].empty?
      member.languages = member_ob['languages'].join(', ') unless member_ob['languages'].empty?
      member.marital_status = member_ob['marital_status'] unless member_ob['marital_status'].empty?
      member.constituency = member_ob['constituency'] unless member_ob['constituency'].empty?
      member.email = member_ob['email'] unless member_ob['email'].empty?
      member.website = member_ob['website'] unless member_ob['website'].empty?

      member.save

      # loop speeches
      member_ob['speeches'].each do |s|
        speech = {
          topic: s['topic'],
          date: s['date'],
          kind: s['type'],
          member: member
        }
        Speech.create(speech)
      end
    end

    # persist questions
    members_str.each_line do |member|
      member_ob = JSON.load member

      member = Member.find_by_names_and_bd member_ob['first_name'], member_ob['sir_name'], member_ob['last_name'], member_ob['date_of_birth']

      member_ob['questions'].each do |q|
        respondent = Member.find_by_two_names q['respondent']
        question = {
          topic: q['topic'],
          questioner: member,
          respondent: respondent,
          asked: q['date']
        }
        Question.create(question)
      end
    end

  end

  # run this task when Members are persisted
  task :svv => :environment do
    File.open("/directory/to/mp-votes.json").each do |voting|
      voting = JSON.load voting
      member = Member.find_by_three_names voting['name']

      raise "No member with name #{voting['name']} found" if member.nil?

      session_date = voting['date'].to_date

      #assembly = Assembly.where("(start_date < ? and end_date > ?) or end_date is ?", session_date, session_date, nil).first
      session = Session.where(date: session_date, url: voting['source']).first_or_create
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
