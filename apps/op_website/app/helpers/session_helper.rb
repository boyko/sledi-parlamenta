module SessionHelper

  # s is for session. 'session' is reserved word for rails
  def process_stenograph s

    members = Member.select("first_name, last_name, id").map { |m| [m.id, m.first_name + " " + m.last_name] }
    votings = Voting.select("id", "topic").by_session(s).ordered.to_a

    stenograph = "<div class='links'>"
    stenograph += votings.map { |v, idx|
      link_to v.topic, "#voting-" + v.id.to_s
    }.join("<br>")
    stenograph += "</div><pre>"
    stenograph += s.stenograph

    stenograph.gsub! "\r\n", "<br>"

    members.each do |m|
      stenograph.gsub! m[1], "<a href='/members/#{m[0]}'>#{m[1]}</a>"
    end

    regex = /Гласували \d+ народни представители: за (\d+|няма), против (\d+|няма), (въздържали се|въздържал се) (\d+|няма|– няма)\./

    regex_enum = stenograph.gsub!(regex)

    regex_enum.each_with_index do |match, idx|
      options = {
       data: { voting: idx },
       class: ["btn", "btn-default", "show-voting"],
       id: "voting-" + votings[idx].id.to_s
      }
      output = button_tag options do
        match
      end
      output += "<br><div id='content-#{idx}'></div>".html_safe
    end
    stenograph + "<pre>"
  end

end
