require 'json'

data_path = "lib/assets/"

namespace :persist do

  # Persist members, question, speeches
  task :mqs => :environment do

    members_str = %x{cat ~/repos/mp-info.json}
    party_arr = []
    members_str.each_line do |member|
      member_ob = JSON.load member

      # find member
      names = member_ob['fn'] + " " + member_ob['sn'] + " " + member_ob['ln']
      member = Member.find_by_names_and_bd(names, member_ob['db'])

      # find assembly
      assembly_data = member_ob['st'].select { |ps| ps['t'] == "Членове на Народно събрание" }
      p assembly_data[0]
      assembly = Assembly.find_by_name(assembly_data[0]['n']) unless assembly_data.empty?
      #p assembly.name unless assembly_data.empty?

      # find party
      party_data = member_ob['st'].select { |ps| ps['t'] == "Парламентарни групи" }
      unless party_data.empty?
        party_name = party_data[0]['n'].split('Парламентарна група на ')[1]
        party = Party.where(assembly: assembly, name: party_name).first
      end

      #raise "no party #{member_ob['gi']}" if party_data.empty?

      #unless party_arr.include? party_data[0]['n']
        #party_arr.push(party_data[0]['n'])
      #end

      # assign other information
      member.party = party unless party.nil?
      member.gov_site_id = member_ob['gi'] # what should it do?
      member.hometown = member_ob['pb']    # all of them have a hometown
      member.profession = member_ob['p'].join(', ') unless member_ob['p'].empty?
      member.languages = member_ob['l'].join(', ') unless member_ob['l'].empty?
      member.marital_status = member_ob['ms'] unless member_ob['ms'].empty?
      member.constituency = member_ob['co'] unless member_ob['co'].empty?
      member.email = member_ob['em'] unless member_ob['em'].empty?
      member.website = member_ob['ws'] unless member_ob['ws'].empty?

      member.save

      # loop questions
      member_ob['q'].each do |q|
        question = {
          title: q['a'],
          questioner: member,
          asked: q['d']
        }
        Question.create(question)
      end

      # loop speeches
      member_ob['s'].each do |s|
        speech = {
          topic: s['t'],
          date: s['d'],
          kind: s['ty'],
          member: member
        }
        Speech.create(speech)
      end
    end
    PP.pp party_arr
  end

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
