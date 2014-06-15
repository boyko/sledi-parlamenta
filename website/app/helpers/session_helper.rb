module SessionHelper

  # s is for session. 'session' is reserved word for rails
  def process_stenograph s

    members = s.members.pluck(:id, :first_name, :last_name).map { |m| [m[0], m[1] + " " + m[2]] }
    votings = s.votes_by_voting.keys.group_by { |v| v[0] }.values

    stenograph = "<pre>" + s.stenograph

    stenograph.gsub! "\r\n", "<br>"

    members.each do |m|
      regex = /(#{m[1]}|#{m[1].mb_chars.upcase.to_s})/
      stenograph.gsub! regex, "<a href='/members/#{m[0]}'>#{m[1]}</a>"
    end

    if votings.length > 0

      regex = /Гласували \d+ народни представители: за (\d+|няма), против (\d+,|няма,|и) въздържал(и се| се) (– )?(\d+|няма)\./
      regex_enum = stenograph.gsub! regex

      regex_enum.each_with_index do |match, idx|
        match + svg_diagram(votings[idx])
      end
    end

    stenograph + "</pre>"
  end

  private

  def svg_diagram voting

    return "" if voting.nil?

    by_parties = voting.group_by { |v| v[1] }
    data = by_parties.map do |k, v|
      {
        party: k,
        members: v.map { |i|
          {
            id: i[2],
            name: i[3] + " " + i[4],
            vote: i[5]
          }
        }
      }
    end

    cols = 8
    width = 15
    height = 15
    margin = 1
    gr_margin = 20

    width_svg = (width+margin)*cols*data.length

    html = "<br><svg width='#{width_svg}' height='220'>"
    data.each_with_index do |p, outer_idx|
      offset = outer_idx * (cols * (width + margin) + gr_margin)
      p[:members].each_with_index do |el, idx|
        x = (idx % cols) * (width + margin) + offset
        y = (idx / cols) * (width + margin)
        html += "<a xlink:href='/members/#{el[:id]}'><g><rect width='#{width}' height='#{height}' x='#{x}' y='#{y}' class='#{Vote.values.key(el[:vote]).to_s}' data-toggle='tooltip' data-placement='top' title='#{el[:name]}'></g></a>"
      end
      html += "<text x='#{offset+(outer_idx*10)}' y='210' font-family='Verdana' font-size='10'>#{p[:party]}</text>"
    end

    html += "</svg>"
    html.html_safe

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
