from django.db import models
from core import settings


# Organizations definitions
class CommonOrganization(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    address = models.TextField(max_length=255, blank=True, null=True)
    email = models.EmailField(blank=True, null=True)
    phone = models.CharField(max_length=255, blank=True, null=True)
    bulstat = models.CharField(max_length=255, blank=True, null=True)
    active = models.BooleanField()

    class Meta:
        abstract = True
        ordering = ['name']


class Company(CommonOrganization):
    # according to http://en.wikipedia.org/wiki/Types_of_business_entity#Bulgaria
    BUSINESS_TYPES = (
        ('AD', 'AD'),
        ('ADSITZ', 'ADSITz'),
        ('EAD', 'EAD'),
        ('EOOD', 'EOOD'),
        ('ET', 'ET'),
        ('OOD', 'OOD'),
        ('KD', 'ADSITz'),
        ('KDA', 'KDA'),
        ('SD', 'SD'),
    )
    kind = models.CharField(max_length=6, choices=BUSINESS_TYPES)
    vat_number = models.CharField(max_length=255, blank=True, null=True)
    eik_number = models.CharField(max_length=255, blank=True, null=True)
    activity = models.TextField(max_length=255, blank=True, null=True)
    founding_act = models.FileField(upload_to='founding_acts', blank=True, null=True)
    founding_act_expires = models.DateField(blank=True, null=True)
    employees = models.ManyToManyField('Person', through='Employee')

    parent = models.ForeignKey('self', blank=True, null=True)


class Party(CommonOrganization):
    color = models.CharField(max_length=7)
    logo = models.ImageField(upload_to='party', blank=True, null=True)
    members = models.ManyToManyField('Person', through='Representative')


class Structure(CommonOrganization):
    public = models.NullBooleanField() # if it is governmental or not
    url = models.URLField(blank=True, null=True)


# Government voting process
class Session(models.Model):
    date = models.DateField()
    url = models.URLField(blank=True, null=True)


class SessionTag(models.Model):
    session = models.ForeignKey(Session)
    tag = models.CharField(max_length=255, blank=True, null=True)


class Voting(models.Model):
    session = models.ForeignKey(Session)
    title = models.CharField(max_length=255)


class Vote(models.Model):
    VOTE_TYPES = (
        ('PRO', 'Pro'),
        ('CONS', 'Cons'),
        ('WHLD', 'Withhold'),
        ('NOVT', 'No vote'),
    )
    voted = models.CharField(max_length=4, choices=VOTE_TYPES, default='NOVT')
    person = models.ForeignKey('Person')
    voting = models.ForeignKey(Voting)


# Person related classes

# Named generally Person as one could not be a representative
class Person(models.Model):
    # personal info
    first_name = models.CharField(max_length=255, blank=True, null=True)
    middle_name = models.CharField(max_length=255, blank=True, null=True)
    last_name = models.CharField(max_length=255)
    photo = models.ImageField(upload_to='person', blank=True, null=True)

    bio = models.TextField(blank=True, null=True)
    occupation = models.CharField(max_length=255, blank=True, null=True)

    contact_twitter = models.CharField(max_length=255, blank=True, null=True)
    contact_facebook = models.CharField(max_length=255, blank=True, null=True)
    contact_email = models.EmailField(blank=True, null=True)
    contact_phone = models.CharField(max_length=255, blank=True, null=True)

    government_profile = models.URLField(blank=True, null=True)

    badges = models.ManyToManyField('Badge', through='PersonBadges')  # add assignment date to this


    # @TODO: add many to many relation with regions

    active = models.BooleanField()


class Representative(models.Model):
    person = models.ForeignKey(Person)
    party = models.ForeignKey(Party)
    date_from = models.DateField(blank=True, null=True)
    date_to = models.DateField(blank=True, null=True)


class Employee(models.Model):
    person = models.ForeignKey(Person)
    company = models.ForeignKey(Company)
    date_from = models.DateField(blank=True, null=True)
    date_to = models.DateField(blank=True, null=True)
    position = models.CharField(max_length=255, blank=True, null=True)


class PersonBadges(models.Model):
    person = models.ForeignKey(Person)
    badge = models.ForeignKey('Badge')
    date_from = models.DateField()
    date_to = models.DateField()
    badge_data = models.CharField(max_length=255, blank=True, null=True)  # contains pickled badge data


class PersonGallery(models.Model):
    person = models.ForeignKey(Person)
    photo = models.ImageField(upload_to='person')
    date_taken = models.DateField(blank=True, null=True)
    source = models.CharField(max_length=255, blank=True, null=True)


class PersonMediaAppearing(models.Model):
    person = models.ForeignKey(Person)
    content = models.TextField()
    date = models.DateField()
    source = models.CharField(max_length=255)


class Promise(models.Model):
    person = models.ForeignKey(Person)
    content = models.TextField()
    promised_at = models.DateField()
    completed_at = models.DateField()


# Law and voting related classes

# http://en.wikipedia.org/wiki/Bill_(law)
class Bill(models.Model):
    proposed_by = models.ManyToManyField(Person, blank=True, null=True)
    proposed_by_structure = models.ManyToManyField(Structure, blank=True, null=True)
    title = models.CharField(max_length=255)
    content = models.TextField()
    proposed_on = models.DateField()
    accepted_on = models.DateField(blank=True, null=True)
    votings = models.ManyToManyField(Voting)
    url = models.URLField()


class Law(models.Model):
    title = models.CharField(max_length=255)
    content = models.TextField()
    published_sg = models.DateField() # date published on State Gazette
    url = models.URLField()


# Misc classes
class Badge(models.Model):
    title = models.CharField(max_length=255)
    active = models.BooleanField()