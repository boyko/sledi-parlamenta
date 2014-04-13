# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)

Assembly.delete_all

a39 = Assembly.create({ name: "39-то Народно събрание", start_date: "05.07.2001".to_date, end_date: "17.06.2005".to_date })
a40 = Assembly.create({ name: "40-то Народно събрание", start_date: "11.07.2005".to_date, end_date: "25.06.2009".to_date })
a41 = Assembly.create({ name: "41-то Народно събрание", start_date: "14.07.2009".to_date, end_date: "15.03.2013".to_date })
a42 = Assembly.create({ name: "42-то Народно събрание", start_date: "21.05.2013".to_date, end_date: nil })

puts "Successfuly imported assemblies"

Party.delete_all

Party.create({ abbreviation: "ГЕРБ", name: "Граждани за Европейско Развитие на България", assembly_id: a42.id })
Party.create({ abbreviation: "КБ", name: "Коалиция за България", assembly_id: a42.id })
Party.create({ abbreviation: "ДПС", name: "Движение за права и свободи", assembly_id: a42.id })
Party.create({ abbreviation: "Aтака", name: "Атакa", assembly_id: a42.id })

#Party.create({ abbreviation: "НДСВ", name: "Национално движение Симеон Втори", assembly: a41 })
#Party.create({ abbreviation: "СК", name: "Синята коалиция", assembly: a41 })
#Party.create({ abbreviation: "РЗС", name: "Ред, законност и справедливост", assembly: a41 })
#Party.create({ abbreviation: "ОДС", name: "Обединени Демократични Сили", assembly: a41 })
#Party.create({ abbreviation: "ДСБ", name: "Демократи за силна България", assembly: a41 })
#Party.create({ abbreviation: "БНС", name: "Български Народен Съюз", assembly: a41 })

puts "Successfuly imported political parties"

#pc = Party.count
#mc = Members.count

#Bill.create({ member_id: (Random.rand() * mc).ceil, party_id: (Random.rand() * pc).ceil, title: "Закон за защита на конкуренцията.", content: "Eдин закон който е важен!\n Конкуренцията е нещо важно. \n Много важно даже. ", proposed_on: Time.now, accepted_on: Time.now, url: "http://bla.com" })
#Bill.create({ member_id: (Random.rand() * mc).ceil, party_id: (Random.rand() * pc).ceil, title: "Закон за защита на потребителите.", content: "Eдин закон който е важен!\n Конкуренцията е нещо важно. \n Много важно даже. ", proposed_on: Time.now, accepted_on: Time.now, url: "http://bla.com" })
#Bill.create({ member_id: (Random.rand() * mc).ceil, party_id: (Random.rand() * pc).ceil, title: "Закон за защита на врабчетата.", content: "Eдин закон който е важен!\n Конкуренцията е нещо важно. \n Много важно даже. ", proposed_on: Time.now, accepted_on: Time.now, url: "http://bla.com" })
#Bill.create({ member_id: (Random.rand() * mc).ceil, party_id: (Random.rand() * pc).ceil, title: "Закон за защита на паветата.", content: "Eдин закон който е важен!\n Конкуренцията е нещо важно. \n Много важно даже. ", proposed_on: Time.now, accepted_on: Time.now, url: "http://bla.com" })
#Bill.create({ member_id: (Random.rand() * mc).ceil, party_id: (Random.rand() * pc).ceil, title: "Закон за защита на листенцата.", content: "Eдин закон който е важен!\n Конкуренцията е нещо важно. \n Много важно даже. ", proposed_on: Time.now, accepted_on: Time.now, url: "http://bla.com" })
#Bill.create({ member_id: (Random.rand() * mc).ceil, party_id: (Random.rand() * pc).ceil, title: "Закон за защита на полицаите.", content: "Eдин закон който е важен!\n Конкуренцията е нещо важно. \n Много важно даже. ", proposed_on: Time.now, accepted_on: Time.now, url: "http://bla.com" })
#Bill.create({ member_id: (Random.rand() * mc).ceil, party_id: (Random.rand() * pc).ceil, title: "Закон за защита на учениците.", content: "Eдин закон който е важен!\n Конкуренцията е нещо важно. \n Много важно даже. ", proposed_on: Time.now, accepted_on: Time.now, url: "http://bla.com" })
#Bill.create({ member_id: (Random.rand() * mc).ceil, party_id: (Random.rand() * pc).ceil, title: "Закон за защита на разни работи.", content: "Eдин закон който е важен!\n Конкуренцията е нещо важно. \n Много важно даже. ", proposed_on: Time.now, accepted_on: Time.now, url: "http://bla.com" })

Member.create!([
  {first_name: "СНЕЖАНА", sir_name: "ВЕЛИКОВА", last_name: "ГРОЗДИЛОВА", gov_site_id: 3, birthday: "1950-10-26", hometown: "с. Катунци, България", profession: "преподавател", languages: "английски, руски", marital_status: "омъжена", constituency: "1-БЛАГОЕВГРАД", email: "", website: "", position: nil, non_affiliated: nil, status: nil, gender: nil, council_ministers: nil, cm_position: nil, bio: nil, party_id: 7},
  {first_name: "ЛЮБЕН", sir_name: "АНДОНОВ", last_name: "КОРНЕЗОВ", gov_site_id: 1, birthday: "1947-01-03", hometown: "Ямбол, България", profession: "юрист", languages: "немски, руски", marital_status: "женен", constituency: "1-БЛАГОЕВГРАД", email: "kornesov@abv.bg", website: "", position: nil, non_affiliated: nil, status: nil, gender: nil, council_ministers: nil, cm_position: nil, bio: nil, party_id: 2},
  {first_name: "БОРИС", sir_name: "ЯНКОВ", last_name: "ЯЧЕВ", gov_site_id: 4, birthday: "1965-07-02", hometown: "Петрич, България", profession: "преподавател", languages: "английски, руски", marital_status: "женен", constituency: "1-БЛАГОЕВГРАД", email: "yachev@vmro-bg.org", website: "", position: nil, non_affiliated: nil, status: nil, gender: nil, council_ministers: nil, cm_position: nil, bio: nil, party_id: 10},
  {first_name: "ГЕОРГИ", sir_name: "ВЛАДИМИРОВ", last_name: "ЮРУКОВ", gov_site_id: 2, birthday: "1955-06-11", hometown: "с.Илинден, България", profession: "юрист", languages: "немски, руски", marital_status: "женен", constituency: "1-БЛАГОЕВГРАД", email: "", website: "", position: nil, non_affiliated: nil, status: nil, gender: nil, council_ministers: nil, cm_position: nil, bio: nil, party_id: 2},
  {first_name: "АЛИОСМАН", sir_name: "ИБРАИМ", last_name: "ИМАМОВ", gov_site_id: 5, birthday: "1953-03-20", hometown: "с. Абланица, България", profession: "преподавател", languages: "английски, руски", marital_status: "женен", constituency: "1-БЛАГОЕВГРАД", email: "aliosman_imamov@yahoo.co.uk", website: "", position: nil, non_affiliated: nil, status: nil, gender: nil, council_ministers: nil, cm_position: nil, bio: nil, party_id: 3},
  {first_name: "СОЛОМОН", sir_name: "ИСАК", last_name: "ПАСИ", gov_site_id: 9, birthday: "1956-12-22", hometown: "Пловдив, България", profession: "друга", languages: "английски, френски, руски", marital_status: "разведен", constituency: "2-БУРГАС", email: "solomonpassy@gmail.com", website: "", position: nil, non_affiliated: nil, status: nil, gender: nil, council_ministers: nil, cm_position: nil, bio: nil, party_id: 7},
  {first_name: "ГЕОРГИ", sir_name: "СТОЯНОВ", last_name: "КАДИЕВ", gov_site_id: 8, birthday: "1966-08-28", hometown: "Бургас, България", profession: "икономист", languages: "английски, немски, руски, полски, виетнамски", marital_status: "женен", constituency: "2-БУРГАС", email: "", website: "", position: nil, non_affiliated: nil, status: nil, gender: nil, council_ministers: nil, cm_position: nil, bio: nil, party_id: 2},
  {first_name: "ЛЮБОМИР", sir_name: "ПЕНЧЕВ", last_name: "ПАНТЕЛЕЕВ", gov_site_id: 7, birthday: "1952-10-17", hometown: "Айтос, България", profession: "журналист", languages: "руски", marital_status: "женен", constituency: "2-БУРГАС", email: "", website: "", position: nil, non_affiliated: nil, status: nil, gender: nil, council_ministers: nil, cm_position: nil, bio: nil, party_id: 2},
  {first_name: "ЯНЕ", sir_name: "ГЕОРГИЕВ", last_name: "ЯНЕВ", gov_site_id: 6, birthday: "1971-04-22", hometown: "Сандански, България", profession: "икономист", languages: "английски, френски, хърватски", marital_status: "неженен", constituency: "1-БЛАГОЕВГРАД", email: "yanev@parliament.bg", website: "", position: nil, non_affiliated: nil, status: nil, gender: nil, council_ministers: nil, cm_position: nil, bio: nil, party_id: 8}
])
