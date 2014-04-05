# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)

Party.delete_all
Member.delete_all
Bill.delete_all

Party.create({ name: "ГЕРБ"})
Party.create({ name: "БСП"})
Party.create({ name: "ДПС"})
Party.create({ name: "Aтака"})

pc = Party.count

Member.create({ name: "Кристина Кристинова", birthday: Time.now, hometown: "Бургас", profession: "Юрист", bio: "Просто обикновен депутат....\n Ето малко редчета... \n И още едно... ", party_id: (Random.rand() * pc).ceil })
Member.create({ name: "Анелия Анелиова", birthday: Time.now, hometown: "Бургас", profession: "Юрист", bio: "Просто обикновен депутат....\n Ето малко редчета... \n И още едно... ", party_id: (Random.rand() * pc).ceil })
Member.create({ name: "Минка Минкова", birthday: Time.now, hometown: "Бургас", profession: "Юрист", bio: "Просто обикновен депутат....\n Ето малко редчета... \n И още едно... ", party_id: (Random.rand() * pc).ceil })
Member.create({ name: "Деница Деницова", birthday: Time.now, hometown: "Бургас", profession: "Юрист", bio: "Просто обикновен депутат....\n Ето малко редчета... \n И още едно... ", party_id: (Random.rand() * pc).ceil })
Member.create({ name: "Жени Женинова", birthday: Time.now, hometown: "Бургас", profession: "Юрист", bio: "Просто обикновен депутат....\n Ето малко редчета... \n И още едно... ", party_id: (Random.rand() * pc).ceil })
Member.create({ name: "Добромира Добромирова", birthday: Time.now, hometown: "Бургас", profession: "Юрист", bio: "Просто обикновен депутат....\n Ето малко редчета... \n И още едно... ", party_id: (Random.rand() * pc).ceil })
Member.create({ name: "Деяна Деянова", birthday: Time.now, hometown: "Бургас", profession: "Юрист", bio: "Просто обикновен депутат....\n Ето малко редчета... \n И още едно... ", party_id: (Random.rand() * pc).ceil })
Member.create({ name: "Ирина Иринова", birthday: Time.now, hometown: "Бургас", profession: "Юрист", bio: "Просто обикновен депутат....\n Ето малко редчета... \n И още едно... ", party_id: (Random.rand() * pc).ceil })
Member.create({ name: "Елена Еленова", birthday: Time.now, hometown: "Бургас", profession: "Юрист", bio: "Просто обикновен депутат....\n Ето малко редчета... \n И още едно... ", party_id: (Random.rand() * pc).ceil })
Member.create({ name: "Елица Елицова", birthday: Time.now, hometown: "Бургас", profession: "Юрист", bio: "Просто обикновен депутат....\n Ето малко редчета... \n И още едно... ", party_id: (Random.rand() * pc).ceil })
Member.create({ name: "Мира Мирева", birthday: Time.now, hometown: "Бургас", profession: "Юрист", bio: "Просто обикновен депутат....\n Ето малко редчета... \n И още едно... ", party_id: (Random.rand() * pc).ceil })
Member.create({ name: "Пенчо Пенков", birthday: Time.now, hometown: "Бургас", profession: "Юрист", bio: "Просто обикновен депутат....\n Ето малко редчета... \n И още едно... ", party_id: (Random.rand() * pc).ceil })
Member.create({ name: "Иван Иванов", birthday: Time.now, hometown: "Бургас", profession: "Юрист", bio: "Просто обикновен депутат....\n Ето малко редчета... \n И още едно... ", party_id: (Random.rand() * pc).ceil })
Member.create({ name: "Maртин Мартинов", birthday: Time.now, hometown: "Бургас", profession: "Юрист", bio: "Просто обикновен депутат....\n Ето малко редчета... \n И още едно... ", party_id: (Random.rand() * pc).ceil })
Member.create({ name: "Петко Петков", birthday: Time.now, hometown: "Бургас", profession: "Юрист", bio: "Просто обикновен депутат....\n Ето малко редчета... \n И още едно... ", party_id: (Random.rand() * pc).ceil })
Member.create({ name: "Георги Георгиев", birthday: Time.now, hometown: "Бургас", profession: "Юрист", bio: "Просто обикновен депутат....\n Ето малко редчета... \n И още едно... ", party_id: (Random.rand() * pc).ceil })
Member.create({ name: "Димитър Димитров", birthday: Time.now, hometown: "Бургас", profession: "Юрист", bio: "Просто обикновен депутат....\n Ето малко редчета... \n И още едно... ", party_id: (Random.rand() * pc).ceil })
Member.create({ name: "Галин Галев", birthday: Time.now, hometown: "Бургас", profession: "Юрист", bio: "Просто обикновен депутат....\n Ето малко редчета... \n И още едно... ", party_id: (Random.rand() * pc).ceil })
Member.create({ name: "Кольо Колев", birthday: Time.now, hometown: "Бургас", profession: "Юрист", bio: "Просто обикновен депутат....\n Ето малко редчета... \n И още едно... ", party_id: (Random.rand() * pc).ceil })
Member.create({ name: "Борислав Бориславов", birthday: Time.now, hometown: "Бургас", profession: "Юрист", bio: "Просто обикновен депутат....\n Ето малко редчета... \n И още едно... ", party_id: (Random.rand() * pc).ceil })
Member.create({ name: "Божидар Божидаров", birthday: Time.now, hometown: "Бургас", profession: "Юрист", bio: "Просто обикновен депутат....\n Ето малко редчета... \n И още едно... ", party_id: (Random.rand() * pc).ceil })

mc = Member.count

Bill.create({ member_id: (Random.rand() * mc).ceil, party_id: (Random.rand() * pc).ceil, title: "Закон за защита на конкуренцията.", content: "Eдин закон който е важен!\n Конкуренцията е нещо важно. \n Много важно даже. ", proposed_on: Time.now, accepted_on: Time.now, url: "http://bla.com" })
Bill.create({ member_id: (Random.rand() * mc).ceil, party_id: (Random.rand() * pc).ceil, title: "Закон за защита на потребителите.", content: "Eдин закон който е важен!\n Конкуренцията е нещо важно. \n Много важно даже. ", proposed_on: Time.now, accepted_on: Time.now, url: "http://bla.com" })
Bill.create({ member_id: (Random.rand() * mc).ceil, party_id: (Random.rand() * pc).ceil, title: "Закон за защита на врабчетата.", content: "Eдин закон който е важен!\n Конкуренцията е нещо важно. \n Много важно даже. ", proposed_on: Time.now, accepted_on: Time.now, url: "http://bla.com" })
Bill.create({ member_id: (Random.rand() * mc).ceil, party_id: (Random.rand() * pc).ceil, title: "Закон за защита на паветата.", content: "Eдин закон който е важен!\n Конкуренцията е нещо важно. \n Много важно даже. ", proposed_on: Time.now, accepted_on: Time.now, url: "http://bla.com" })
Bill.create({ member_id: (Random.rand() * mc).ceil, party_id: (Random.rand() * pc).ceil, title: "Закон за защита на листенцата.", content: "Eдин закон който е важен!\n Конкуренцията е нещо важно. \n Много важно даже. ", proposed_on: Time.now, accepted_on: Time.now, url: "http://bla.com" })
Bill.create({ member_id: (Random.rand() * mc).ceil, party_id: (Random.rand() * pc).ceil, title: "Закон за защита на полицаите.", content: "Eдин закон който е важен!\n Конкуренцията е нещо важно. \n Много важно даже. ", proposed_on: Time.now, accepted_on: Time.now, url: "http://bla.com" })
Bill.create({ member_id: (Random.rand() * mc).ceil, party_id: (Random.rand() * pc).ceil, title: "Закон за защита на учениците.", content: "Eдин закон който е важен!\n Конкуренцията е нещо важно. \n Много важно даже. ", proposed_on: Time.now, accepted_on: Time.now, url: "http://bla.com" })
Bill.create({ member_id: (Random.rand() * mc).ceil, party_id: (Random.rand() * pc).ceil, title: "Закон за защита на разни работи.", content: "Eдин закон който е важен!\n Конкуренцията е нещо важно. \n Много важно даже. ", proposed_on: Time.now, accepted_on: Time.now, url: "http://bla.com" })


