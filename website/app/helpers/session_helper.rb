module SessionHelper

  # s is for session. 'session' is reserved word for rails
  def process_stenograph s

    members = Member.select("first_name, last_name, id").map { |m| [m.id, m.first_name + " " + m.last_name] }
    votings = Voting.select("id", "topic").by_session(s).non_registration.ordered.to_a

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
    stenograph + "</pre>"
  end

  def calendar year, &block
    year = (year.beginning_of_year..year.end_of_year).map { |d| Date.new(d.year, d.month, 1) }.uniq.in_groups_of(4)
    content_tag :table, class: "table table-bordered" do
      year.map do |quarter|
        content_tag :tr do
          quarter.map do |month|
            content_tag :td do
              self.capture(month, &block)
            end
          end.join.html_safe
        end
      end.join.html_safe
    end
  end

  def monthly month
    first = month.beginning_of_month.beginning_of_week(:monday)
    last = month.end_of_month.end_of_week(:monday)
    weeks = (first..last).to_a.in_groups_of(7)
    content_tag :table, class: "table table-condensed" do
      weeks.map do |week|
        content_tag :tr do
          week.map do |day|
            s = @sessions[day]
            klass = s.nil? ? "" : "info"
            cont = s.nil? ? day.strftime("%d") : link_to(day.strftime("%d"), session_path(s[0]))
            content_tag :td , class: klass do
              cont
            end
          end.join.html_safe
        end
      end.join.html_safe
    end
  end

end
