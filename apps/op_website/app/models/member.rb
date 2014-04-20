class Member < ActiveRecord::Base
  has_many :votes
  has_many :speeches
  has_many :questions, :foreign_key => "questioner_id"
  has_many :participations
  has_many :structures, through: :participations

  def self.find_by_three_names names
    names = names.split
    if names[3].nil?
      Member.where(:first_name => names[0], :sir_name => names[1], :last_name => names[2]).first
    else
      Member.where(:first_name => names[0], :sir_name => names[1], :last_name => (names[2] + " " + names[3])).first
    end
  end

  def self.find_by_two_names names
    names = names.split.map { |n| n.mb_chars.upcase.to_s }
    Member.where(:first_name => names[0], :last_name => names[1]).first
  end

  def self.find_by_names_and_bd first_name, sir_name, last_name, date_of_birth
    if date_of_birth == '00/00/0000'
      Member.where(:first_name => first_name, :sir_name => sir_name, :last_name => last_name).first_or_initialize
    else
      birth_day = Date.parse(date_of_birth).strftime("%Y-%m-%d")
      Member.where(:first_name => first_name, :sir_name => sir_name, :last_name => last_name, birthday: birth_day).first_or_initialize
    end
  end

  def names
    (self.first_name + " " + self.sir_name + " " + self.last_name).mb_chars.titleize
  end

  def assemblies
    Participation.where(member: self).joins(:structure).where("structures.kind == ?", "Членове на Народно събрание")
  end

  def parties
    Participation.where(member: self).joins(:structure).where("structures.kind == ?", "Парламентарни групи")
  end

  def comittees
    Participation.where(member: self).joins(:structure).where("structures.kind == ?", "Постоянни парламентарни комисии")
  end

  def t_comittees
    Participation.where(member: self).joins(:structure).where("structures.kind == ?", "Временни парламентарни комисии")
  end

  def subcomittees
    Participation.where(member: self).joins(:structure).where("structures.kind == ?", "Парламентарни подкомисии")
  end

  def delegations
    Participation.where(member: self).joins(:structure).where("structures.kind == ?", "Парламентарни делегации")
  end

  def friendship_groups
    Participation.where(member: self).joins(:structure).where("structures.kind == ?", "Групи за приятелство")
  end

  def party date
    participation = Participation
      .where("member_id == ? and ((start_date <= ? and end_date >= ?) or end_date is ?)", self.id, date, date, nil)
      .joins(:structure).where("structures.kind == ?", "Парламентарни групи").first

    raise "No such party found!" if participation.nil?

    participation
  end

end
