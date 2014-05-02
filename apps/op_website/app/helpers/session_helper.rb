module SessionHelper
  # s is for session. 'session' is reserved word for rails
  def process_stenograph s

    members = Member.select("first_name, last_name, id").map { |m| [m.id, m.first_name + " " + m.last_name] }

    stenograph = s.stenograph

    stenograph.gsub! "\r\n", "<br>"

    members.each do |m|
      stenograph.gsub! m[1], "<a href='/members/#{m[0]}'>#{m[1]}</a>"
    end

    regex = /Гласували \d+ народни представители: за (\d+|няма), против (\d+|няма), (въздържали се|въздържал се) (\d+|няма|– няма)\./

    regex_enum = stenograph.gsub!(regex)

    regex_enum.each_with_index do |match, idx|
      options = {
       data: { voting: idx },
       class: ["btn", "btn-default", "show-voting"]
      }
      output = button_tag options do
        match
      end
      output += "<br><div id='content-#{idx}'></div>".html_safe
    end
    stenograph
  end

end
