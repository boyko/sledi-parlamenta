module SessionHelper

  # s is for session. 'session' is reserved word for rails
  def process_stenograph s

    stenograph = "<pre>" + s.stenograph
    stenograph + "</pre>"
  end

  private

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
