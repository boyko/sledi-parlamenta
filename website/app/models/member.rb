class Member < ActiveRecord::Base
  has_many :votes
  has_many :votings, through: :votes
  has_many :speeches
  has_many :questions, :foreign_key => "questioner_id"
  has_many :participations
  has_many :structures, through: :participations

  scope :by_date, ->(date) {
    participation = Participation.arel_table
    where(
      (participation[:start_date].lt(date)).and(participation[:end_date].gt(date)).or(
      (participation[:start_date].lt(date)).and(participation[:end_date].eq(nil))
    ))
  }

  scope :by_party, -> { joins(:structures).where(structures: { kind: Structure.kinds[:party]}) }
  scope :by_party_name, ->(name) { by_party.where(structures: { name: name }) }
  scope :by_constituency, ->(constituency) { joins(:participations).where(participations: { constituency: constituency }).uniq }
  scope :order_by_names, -> { order(:first_name, :sir_name, :last_name) }

  def self.find_by_three_names names
    return nil if names == nil or names == ""
    names = names.split
    if names[3].nil?
      Member.where(:first_name => names[0], :sir_name => names[1], :last_name => names[2]).first_or_create
    else
      Member.where(:first_name => names[0], :sir_name => names[1], :last_name => (names[2] + " " + names[3])).first_or_create
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
    self.first_name + " " + self.sir_name + " " + self.last_name
  end

  def assemblies
    Participation.where(member: self).joins(:structure).where(structures: { kind: Structure.kinds[:assembly]})
  end

  def parties
    Participation.where(member: self).joins(:structure).where(structures: { kind: Structure.kinds[:party]})
  end

  def committees
    Participation.where(member: self).joins(:structure).where(structures: { kind: Structure.kinds[:committee]})
  end

  def t_committees
    Participation.where(member: self).joins(:structure).where(structures: { kind: Structure.kinds[:t_committee]})
  end

  def subcommittees
    Participation.where(member: self).joins(:structure).where(structures: { kind: Structure.kinds[:subcommittee]})
  end

  def delegations
    Participation.where(member: self).joins(:structure).where(structures: { kind: Structure.kinds[:delegation]})
  end

  def f_groups
    Participation.where(member: self).joins(:structure).where(structures: { kind: Structure.kinds[:f_group]})
  end

  def age
    dob = self.birthday
    return nil if dob.nil?
    now = Time.now.utc.to_date
    now.year - dob.year - ((now.month > dob.month || (now.month == dob.month && now.day >= dob.day)) ? 0 : 1)
  end

  # only non-empty queries allowed
  def self.search(query)
    sql = query.split.map do |word|
     %w[first_name sir_name last_name].map do |column|
      sanitize_sql ["lower(#{column}) LIKE lower(?)", "%#{word}%"]
     end.join(" or ")
    end.join(") and (")
    where("(#{sql})")
  end

  def self.create_joins structure_ids
    if structure_ids.empty?
      all
    else
      structure_ids.each_with_index.map { |id, idx|
        joins("INNER JOIN participations p#{idx} ON p#{idx}.member_id = members.id")
        .where("p#{idx}.structure_id" => id).uniq
      }.reduce(:merge)
    end
  end
end
