class Member < ActiveRecord::Base
  belongs_to :party
  has_many :votes
  has_many :speeches
  has_many :asked, :foreign_key => "questioner_id"

  def self.find_by_three_names names
    names = names.split
    Member.where(:first_name => names[0], :sir_name => names[1], :last_name => names[2]).first
  end

  def self.find_by_two_names names
    names = names.split.map { |n| n.mb_chars.upcase.to_s }
    Member.where(:first_name => names[0], :last_name => names[1]).first
  end

  def self.find_by_names_and_bd names, db
    names = names.split
    if db == '00/00/0000'
      return Member.where(:first_name => names[0], :sir_name => names[1], :last_name => names[2]).first_or_initialize
    else
      birth_day = Date.parse(db).strftime("%Y-%m-%d")
      return Member.where(:first_name => names[0], :sir_name => names[1], :last_name => names[2], birthday: birth_day).first_or_initialize
    end
  end

end
