# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)

Party.delete_all

Party.create({ abbreviation: "ГЕРБ", name: "Граждани за Европейско Развитие на България"})
Party.create({ abbreviation: "КБ", name: "Коалиция за България"})
Party.create({ abbreviation: "ДПС", name: "Движение за права и свободи"})
Party.create({ abbreviation: "Aтака", name: "Атакa"})
Party.create({ abbreviation: "НДСВ", name: "Национално движение Симеон Втори"})
Party.create({ abbreviation: "СК", name: "Синята коалиция"})
Party.create({ abbreviation: "РЗС", name: "Ред, законност и справедливост"})
Party.create({ abbreviation: "ОДС", name: "Обединени Демократични Сили"})
Party.create({ abbreviation: "ДСБ", name: "Демократи за силна България"})
Party.create({ abbreviation: "БНС", name: "Български Народен Съюз"})

puts "Successfuly imported political parties"

pc = Party.count
mc = Members.count

Bill.create({ member_id: (Random.rand() * mc).ceil, party_id: (Random.rand() * pc).ceil, title: "Закон за защита на конкуренцията.", content: "Eдин закон който е важен!\n Конкуренцията е нещо важно. \n Много важно даже. ", proposed_on: Time.now, accepted_on: Time.now, url: "http://bla.com" })
Bill.create({ member_id: (Random.rand() * mc).ceil, party_id: (Random.rand() * pc).ceil, title: "Закон за защита на потребителите.", content: "Eдин закон който е важен!\n Конкуренцията е нещо важно. \n Много важно даже. ", proposed_on: Time.now, accepted_on: Time.now, url: "http://bla.com" })
Bill.create({ member_id: (Random.rand() * mc).ceil, party_id: (Random.rand() * pc).ceil, title: "Закон за защита на врабчетата.", content: "Eдин закон който е важен!\n Конкуренцията е нещо важно. \n Много важно даже. ", proposed_on: Time.now, accepted_on: Time.now, url: "http://bla.com" })
Bill.create({ member_id: (Random.rand() * mc).ceil, party_id: (Random.rand() * pc).ceil, title: "Закон за защита на паветата.", content: "Eдин закон който е важен!\n Конкуренцията е нещо важно. \n Много важно даже. ", proposed_on: Time.now, accepted_on: Time.now, url: "http://bla.com" })
Bill.create({ member_id: (Random.rand() * mc).ceil, party_id: (Random.rand() * pc).ceil, title: "Закон за защита на листенцата.", content: "Eдин закон който е важен!\n Конкуренцията е нещо важно. \n Много важно даже. ", proposed_on: Time.now, accepted_on: Time.now, url: "http://bla.com" })
Bill.create({ member_id: (Random.rand() * mc).ceil, party_id: (Random.rand() * pc).ceil, title: "Закон за защита на полицаите.", content: "Eдин закон който е важен!\n Конкуренцията е нещо важно. \n Много важно даже. ", proposed_on: Time.now, accepted_on: Time.now, url: "http://bla.com" })
Bill.create({ member_id: (Random.rand() * mc).ceil, party_id: (Random.rand() * pc).ceil, title: "Закон за защита на учениците.", content: "Eдин закон който е важен!\n Конкуренцията е нещо важно. \n Много важно даже. ", proposed_on: Time.now, accepted_on: Time.now, url: "http://bla.com" })
Bill.create({ member_id: (Random.rand() * mc).ceil, party_id: (Random.rand() * pc).ceil, title: "Закон за защита на разни работи.", content: "Eдин закон който е важен!\n Конкуренцията е нещо важно. \n Много важно даже. ", proposed_on: Time.now, accepted_on: Time.now, url: "http://bla.com" })

