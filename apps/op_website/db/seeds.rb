# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)

Assembly.delete_all

# Some of the names are wrong... But otherwise the code breaks.
a39 = Assembly.create({ name: "39-то Народно Събрание", start_date: "05.07.2001".to_date, end_date: "17.06.2005".to_date })
a40 = Assembly.create({ name: "40-то Народно събрание", start_date: "11.07.2005".to_date, end_date: "25.06.2009".to_date })
a41 = Assembly.create({ name: "41-то Народно събрание", start_date: "14.07.2009".to_date, end_date: "15.03.2013".to_date })
a42 = Assembly.create({ name: "42-то Народно събрание", start_date: "21.05.2013".to_date, end_date: nil })

puts "Successfuly imported assemblies"

Party.delete_all

# 42
Party.create({ abbreviation: "ГЕРБ", name: "Граждани за Европейско Развитие на България", assembly: a42 })
Party.create({ abbreviation: "КБ", name: "Коалиция за България", assembly: a42 })
Party.create({ abbreviation: "ДПС", name: "Движение за права и свободи", assembly: a42 })
Party.create({ abbreviation: "Aтака", name: "Атакa", assembly: a42 })
# 41
Party.create({ abbreviation: "ГЕРБ", name: "Граждани за Европейско Развитие на България", assembly: a41 })
Party.create({ abbreviation: "КБ", name: "Коалиция за България", assembly: a41 })
Party.create({ abbreviation: "ДПС", name: "Движение за права и свободи", assembly: a41 })
Party.create({ abbreviation: "Aтака", name: "Атакa", assembly: a41 })
Party.create({ abbreviation: "СК", name: "Синята коалиция", assembly: a41 })
Party.create({ abbreviation: "РЗС", name: "Ред, законност и справедливост", assembly: a41 })
# 40
Party.create({ abbreviation: "КБ", name: "Коалиция за България", assembly: a40 })
Party.create({ abbreviation: "НДСВ", name: "Национално движение Симеон Втори", assembly: a40 })
Party.create({ abbreviation: "ДПС", name: "Движение за права и свободи", assembly: a40 })
Party.create({ abbreviation: "Aтака", name: "Национален съюз Атака", assembly: a40 })
Party.create({ abbreviation: "ОДС", name: "Обединени Демократични Сили", assembly: a40 })
Party.create({ abbreviation: "ДСБ", name: "Демократи за силна България", assembly: a40 })
Party.create({ abbreviation: "БНС", name: "Български Народен Съюз", assembly: a40 })
# 39
Party.create({ abbreviation: "НДСВ", name: "Национално движение Симеон Втори", assembly: a39 })
Party.create({ abbreviation: "ОДС", name: "Обединени демократични сили", assembly: a39 })
Party.create({ abbreviation: "КБ", name: "Коалиция за България", assembly: a39 })
Party.create({ abbreviation: "ДПС", name: "Движение за права и свободи", assembly: a39 })

puts "Successfuly imported political parties"

