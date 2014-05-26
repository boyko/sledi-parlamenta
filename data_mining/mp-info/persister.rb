# Persists members, question, speeches

require 'json'

class String
  def ttlz
    self.mb_chars.titleize.to_s
  end
end

$stdin.each_line do |member|
  member_ob = JSON.load member

  # find member - this will merge profiles
  member = Member.find_by_names_and_bd(
    member_ob['first_name'].ttlz,
    member_ob['sir_name'].ttlz,
    member_ob['last_name'].ttlz,
    member_ob['date_of_birth']
  )

  member_ob['structures'].each do |s|

    abbreviation = ""
    abbreviations = {
      "ПП ГЕРБ" => "ГЕРБ",
      "Атака" => "Атака",
      "Национално движение Симеон Втори" => "НДСВ",
      "Национално движение за стабилност и възход" => "НДСВ",
      "Коалиция за България" => "КБ",
      "Ред, законност и справедливост" => "РЗС",
      "Движение за права и свободи" => "ДПС",
      "Синята коалиция - СДС, ДСБ, Обединени земеделци, БСДП, РДП" => "СК",
    }

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
    if type == "party"
      name = name
        .gsub("Парламентарна група на ", "").gsub("Парламентарен съюз на ", "")
        .gsub("Парламентарна група ", "").gsub("&quot;", "")
        .gsub("партия АТАКА", "Атака")
        .gsub("партия Атака", "Атака")
        .gsub("Коалиция Атака", "Атака")
        .gsub("Нечленуващи в ПГ", "Независими")


      abbreviation = abbreviations[name]
    end

    if type == "assembly"
      name = name
        .gsub("39-то Народно Събрание", "39-то Народно събрание")
        .gsub("41-о Народно събрание", "41-во Народно събрание")
    end

    name = name.mb_chars.downcase.capitalize.to_s if type == "comittee"

    name = name.gsub("\n", "").gsub("\r\n", "")

    structure = Structure.find_or_create_by(name: name, kind: Structure.kinds[type.to_sym], abbreviation: abbreviation)
    constituency = type == "party" ? member_ob['constituency'] : nil
    Participation.create({
      member: member,
      structure: structure,
      position: s['position'],
      start_date: s['from'],
      end_date: s['to'],
      constituency: constituency
    })
  end

  # assign other information
  prev_gsid = member.gov_site_ids.nil? ? "" : member.gov_site_ids.to_s + ", " # append gsids
  member.gov_site_ids = prev_gsid + member_ob['gov_site_id']
  member.hometown = member_ob['place_of_birth']
  member.profession = member_ob['professions'].join(', ') unless member_ob['professions'].empty?
  member.languages = member_ob['languages'].join(', ') unless member_ob['languages'].empty?
  member.marital_status = member_ob['marital_status'] unless member_ob['marital_status'].empty?
  member.email = member_ob['email'] unless member_ob['email'].empty?
  member.website = member_ob['website'] unless member_ob['website'].empty?

  member.save

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

# all members, structures, questions and speeches are persisted by now.
# Get assemblies and assign them the timerange.

data = [["39-то Народно събрание", "05.07.2001", "17.06.2005"],
        ["40-то Народно събрание", "11.07.2005", "25.06.2009"],
        ["41-во Народно събрание", "14.07.2009", "15.03.2013"],
        ["42-ро Народно събрание", "21.05.2013", nil]]

data.each do |a|
  s = Structure.find_by_name(a[0])
  s.start_date = a[1]
  s.end_date = a[2]
  s.save
end

