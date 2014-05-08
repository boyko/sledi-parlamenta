class Member < ActiveRecord::Base
  has_many :votes
  has_many :votings, through: :votes
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
    Participation.where(member: self).joins(:structure).where("structures.kind == ?", "assembly")
  end

  def parties
    Participation.where(member: self).joins(:structure).where("structures.kind == ?", "party")
  end

  def comittees
    Participation.where(member: self).joins(:structure).where("structures.kind == ?", "comittee")
  end

  def t_comittees
    Participation.where(member: self).joins(:structure).where("structures.kind == ?", "t_comittee")
  end

  def subcomittees
    Participation.where(member: self).joins(:structure).where("structures.kind == ?", "subcomittee")
  end

  def delegations
    Participation.where(member: self).joins(:structure).where("structures.kind == ?", "delegation")
  end

  def friendship_groups
    Participation.where(member: self).joins(:structure).where("structures.kind == ?", "f_group")
  end

  def party date
    participation = Participation
      .where("member_id == ? and ((start_date <= ? and end_date >= ?) or (start_date <= ? and end_date is ?)", self.id, date, date, date, nil)
      .joins(:structure).where("structures.kind == ?", "party").first

    raise "No such party found!" if participation.nil?

    participation
  end

  def age
    dob = self.birthday
    return nil if dob.nil?
    now = Time.now.utc.to_date
    now.year - dob.year - ((now.month > dob.month || (now.month == dob.month && now.day >= dob.day)) ? 0 : 1)
  end

  def self.party party_name
    Member.all.joins(:structures).where("structures.kind == ? and structures.name == ?", "party", party_name)
  end

  def self.search(query)
    if query.blank?
      all
    else
      sql = query.split.map do |word|
       %w[first_name sir_name last_name].map do |column|
        sanitize_sql ["#{column} LIKE ?", "%#{word}%"]
       end.join(" or ")
      end.join(") and (")
      where("(#{sql})")
    end
  end

  def self.create_joins structure_ids
    if structure_ids.empty?
      all
    else
      structure_ids.each_with_index.map { |id, idx|
        joins("INNER JOIN 'participations' 'p#{idx}' ON 'p#{idx}'.'member_id' = 'members'.'id'")
        .where("p#{idx}.structure_id" => id).uniq
      }.reduce(:merge)
    end
  end
end
