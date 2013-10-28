from django.db import models
from core import settings


# GENERAL @TODO: consider nullable fields and add blank=True, null=True to params

class Party(models.Model):
    title = models.CharField(max_length=255)
    color = models.CharField(max_length=7)
    logo = models.ImageField(upload_to='party')

	active = models.BooleanField()


# Named generally Person as one could not be a representative
class Person(models.Model):
	# personal info
	first_name = models.CharField(max_length=255)
	middle_name = models.CharField(max_length=255)
	last_name = models.CharField(max_length=255)
	photo = models.ImageField(upload_to='person')

	bio = models.TextField()
	occupation = models.CharField(max_length=255)

	contact_twitter = models.CharField(max_length=255)
	contact_facebook = models.CharField(max_length=255)
	contact_email = models.EmailField()
	contact_phone = models.CharField(max_length=255)

	# party related info
	party = models.ManyToManyField(Party) # find how to add dates to this relation so one's migrations could be traced. if impossible - add relation class
	bills = models.ManyToManyField(Bill) # http://en.wikipedia.org/wiki/Bill_(law)
	government_profile = models.URLField()

	badges = models.ManyToManyField(Badges) # add assignment date to this


	# @TODO: add many to many relation with regions

	active = models.BooleanField()


class PersonGallery(models.Model):
	person = models.ForeignKey(Person)
	photo = models.ImageField(upload_to='person')
	date_taken = models.DateField()
	source = models.CharField(max_length=255)


class PersonMediaAppearing(models.Model):
	person = models.ForeignKey(Person)
	content = models.TextField()
	date = models.DateField()
	source = models.CharField(max_length=255)


class PersonActivity(models.Model):
	person = models.ForeignKey(Person)
	party = models.ForeignKey(Party)
	structure = models.ForeignKey(Structure)

	position = models.CharField(max_length=255)
	content = models.TextField()
	date_from = models.DateField()
	date_to = models.DateField()
	source = models.CharField(max_length=255)


class Badge(models.Model):
	title = models.CharField(max_length=255)

	active = models.BooleanField()


class Promise(models.Model):
	person = models.ForeignKey(Person)
	content = models.TextField()
	promsied_at = models.DateField()
	completed_at = models.DateField()


class Structure(models.Model):
	title = models.CharField(max_length=255)
	description = models.TextField()
	public = models.BooleanField() # if it is governmental or not
	url = models.URLField()


class Bill(models.Model):
	proposed_by = models.ManyToManyField(Person)
	proposed_by_structure = models.ManyToManyField(Structure)
	title = models.CharField(max_length=255)
	content = models.TextField()
	proposed_on = models.DateField()
	accepted_on = models.DateField()
	votings = models.ManyToManyField(Voting)
	url = models.URLField()


class Law(models.Model):
	title = models.CharField(max_length=255)
	content = models.TextField()
	published_sg = models.DateField() # date published on State Gazette
	url = models.URLField()


class Session(models.Model):
	date = models.DateField()
	url = models.URLField()

class SessionTag(models.Model):
	session = models.ForeignKey(Session)
	tag = models.CharField(max_length=255)


class Voting(models.Model):
	session = models.ForeignKey(Session)
	title = models.CharField(max_length=255)
	# ...

class Vote(models.Model):
    VOTE_TYPES = (
        (PRO, 'Pro'),
        (CONS, 'Cons'),
        (WHLD, 'Withhold'),
        (NOVT, 'No vote'),
    )
    voted = models.CharField(max_length=4,
                                      choices=VOTE_TYPES,
                                      default=NOVOTE)
	person = models.ForeignKey(Person)
	voting = models.ForeignKey(Voting)


class Company(models.Model):
	name = models.CharField(max_length=255)

	# according to http://en.wikipedia.org/wiki/Types_of_business_entity#Bulgaria
	BUSINESS_TYPES = (
		(AD, 'AD'),
		(ADSITZ, 'ADSITz'),
		(EAD, 'EAD'),
		(EOOD, 'EOOD'),
		(ET, 'ET'),
		(OOD, 'OOD'),
		(KD, 'ADSITz'),
		(KDA, 'KDA'),
		(SD, 'SD'),
	)
    kind = models.CharField(max_length=6,
                                      choices=VOTE_TYPES,
                                      default=NOVOTE)
    vat_number = models.CharField()
    activity = models.TextField()
    address = models.TextField()
    email = models.EmailField()
    phone = models.CharField(max_length=255)
    founding_act = models.FileField(upload_to='founding_acts')
    founding_act_expires = models.DateField()

    employees = models.ManyToManyField(Person) # @TODO add position, dates. if cannot be done in here, add separate class for this relation

    parent = models.ForeignKey(Company)