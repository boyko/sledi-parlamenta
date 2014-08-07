class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception

  def faq
  end

  private

  def prepare_data records
    votes = records.map { |v| v.flatten }
    data = []
    words = ["absent", "abstain", "no", "yes"].reverse

    categories = votes.map { |v| v[0] }.uniq
    categories.each do |p|
      current = votes.select { |v| v[0] == p }.map { |v| v[1] }
      missing = words - current
      missing.each do |mw|
        idx = votes.index { |v| v[0] == p }
        votes.insert(idx+2, [p, mw, 0])
      end
    end

    words.each do |w|
      data.push({
        name: w,
        data: votes.select { |v| v[1] == w }.map { |v| v[2] }
      })
    end

    {
      categories: categories,
      data: data
    }
  end

end
