require 'json'

data_path = "lib/assets/"

namespace :persist do

  # Persist members, question, speeches
  task :mqs => :environment do

    a39 = Assembly.find_by_name("39-то Народно събрание")
    a40 = Assembly.find_by_name("40-то Народно събрание")
    a41 = Assembly.find_by_name("41-то Народно събрание")
    a42 = Assembly.find_by_name("42-то Народно събрание")

    party_dict = {
      # 42
      "ПП „ГЕРБ“"                                       =>  Party.where(assembly: a42, abbreviation: "ГЕРБ").first,
      "КП „Коалиция за България“"                       =>  Party.where(assembly: a42, abbreviation: "КБ").first,
      "ПП „Движение за права и свободи“"                =>  Party.where(assembly: a42, abbreviation: "ДПС").first,
      "ПП „Атака“"                                      =>  Party.where(assembly: a42, abbreviation: "АТАКА").first,
      # 41
      "ГЕРБ"                                            =>  Party.where(assembly: a41, abbreviation: "ГЕРБ").first,
      '"Коалиция за България"'                          =>  Party.where(assembly: a41, abbreviation: "КБ").first,
      'ДПС "Движение за права и свободи"'               =>  Party.where(assembly: a41, abbreviation: "ДПС").first,
      'Партия "Атака"'                                  =>  Party.where(assembly: a41, abbreviation: "Атака").first,
      '"Синята коалиция"'                               =>  Party.where(assembly: a41, abbreviation: "СК").first,
      '"Ред, законност и справедливост"'                =>  Party.where(assembly: a41, abbreviation: "РЗС").first,
      # 40
      '"Коалиция за България"'                          =>  Party.where(assembly: a40, abbreviation: "КБ").first,
      '"Национално движение Симеон Втори"'              =>  Party.where(assembly: a40, abbreviation: "НДСВ").first,
      '"Движение за права и свободи"'                   =>  Party.where(assembly: a40, abbreviation: "ДПС").first,
      'Коалиция "Атака"'                                =>  Party.where(assembly: a40, abbreviation: "Атака").first,
      'Коалиция "Обединени Демократични Сили"'          =>  Party.where(assembly: a40, abbreviation: "ОДС").first,
      '"Демократи за Силна България"'                   =>  Party.where(assembly: a40, abbreviation: "ДСБ").first,
      'Коалиция "Български Народен Съюз"'               =>  Party.where(assembly: a40, abbreviation: "БНС").first,
      # 39
      '“Национално движение Симеон Втори”'              =>  Party.where(assembly: a39, abbreviation: "НДСВ").first,
      '“Обединени демократични сили – СДС, Народен съюз: БЗНС-Народен съюз и Демократическа партия, БСДП, Национално ДПС”'  =>  Party.where(assembly: a39, abbreviation: "ОДС").first,
      '"Коалиция за България"'                          =>  Party.where(assembly: a39, abbreviation: "КБ").first,
      'ДПС (ДПС – Либерален съюз – Евророма)'           =>  Party.where(assembly: a39, abbreviation: "КБ").first
    }

    members_str = %x{node ../assets/mp-info.js}
    members_str.each_line do |member|
      member_ob = JSON.load member
      final = {
        first_name: member_ob['fn'],
        sir_name: member_ob['sn'],
        last_name: member_ob['ln'],
        gov_site_id: member_ob['gi'],
        birthday: member_ob['db'],
        hometown: member_ob['pb'],
        profession: member_ob['p'].join(', '),
        languages: member_ob['l'].join(', '),
        marital_status: member_ob['ms'],
        party: party_dict[member_ob['pf']],
        constituency: member_ob['co'],
        email: member_ob['em'],
        website: member_ob['ws'],
      }
      m = Member.create(final)

      # loop questions
      member_ob['q'].each do |q|
        question = {
          title: q['a'],
          questioner: m,
          asked: q['d']
        }
        Question.create(question)
      end

      # loop speeches
      member_ob['s'].each do |s|
        speech = {
          topic: s['t'],
          date: s['d'],
          kind: s['ty']
        }
        Speech.create(speech)
      end
    end
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
