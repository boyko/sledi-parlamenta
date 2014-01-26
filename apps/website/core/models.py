from django.db import models


# GENERAL @TODO: consider nullable fields and add blank=True, null=True to params

# Organizations definitions
class CommonOrganization(models.Model):
    name = models.TextField()
    description = models.TextField(blank=True, null=True)
    address = models.TextField(max_length=255, blank=True, null=True)
    email = models.EmailField(blank=True, null=True)
    phone = models.CharField(max_length=255, blank=True, null=True)
    active = models.BooleanField(default=True)

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
    vat_number = models.CharField(max_length=255)
    activity = models.TextField(max_length=255)
    founding_act = models.FileField(upload_to='founding_acts')
    founding_act_expires = models.DateField()

    parent = models.ForeignKey('self')


class Structure(CommonOrganization):
    type = models.CharField(max_length=255, blank=True, null=True)
    url = models.URLField(blank=True, null=True)
    members = models.ManyToManyField('Person', through='Member')


# Misc classes
class Badge(models.Model):
    title = models.CharField(max_length=255)
    active = models.BooleanField()


class Session(models.Model):
    date = models.DateField()
    url = models.URLField()


class SessionTag(models.Model):
    session = models.ForeignKey(Session)
    tag = models.CharField(max_length=255)


class Voting(models.Model):
    session = models.ForeignKey(Session)
    title = models.CharField(max_length=255)


# Person related classes
# Named generally Person as one could not be a representative
class Person(models.Model):
    # personal info
    first_name = models.CharField(max_length=255)
    middle_name = models.CharField(max_length=255)
    last_name = models.CharField(max_length=255)
    photo = models.ImageField(upload_to='person')
    birthday = models.DateField(blank=True, null=True)
    hometown = models.CharField(max_length=255, blank=True, null=True)
    profession = models.CharField(max_length=255, blank=True, null=True)
    bio = models.TextField(blank=True, null=True)

    contact_twitter = models.CharField(max_length=255, blank=True, null=True)
    contact_facebook = models.CharField(max_length=255, blank=True, null=True)
    contact_email = models.EmailField(blank=True, null=True)
    contact_phone = models.CharField(max_length=255, blank=True, null=True)

    #badges = models.ManyToManyField(Badge) # add assignment date to this

    # @TODO: add many to many relation with regions
    active = models.BooleanField(default=True)

    def __unicode__(self):
        return u"%s %s %s" % (self.first_name, self.middle_name, self.last_name)


class Member(models.Model):
    person = models.ForeignKey(Person)
    structure = models.ForeignKey(Structure)
    date_from = models.DateField(blank=True, null=True)
    date_to = models.DateField(blank=True, null=True)
    position = models.CharField(max_length=255, blank=True, null=True)


class Employee(models.Model):
    person = models.ForeignKey(Person)
    company = models.ForeignKey(Company)
    date_from = models.DateField(blank=True, null=True)
    date_to = models.DateField(blank=True, null=True)
    position = models.CharField(max_length=255, blank=True, null=True)


# Law and voting related classes
# http://en.wikipedia.org/wiki/Bill_(law)
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
    published_sg = models.DateField()  # date published on State Gazette
    url = models.URLField()


class Vote(models.Model):
    VOTE_TYPES = (
        ('PRO', 'Pro'),
        ('CONS', 'Cons'),
        ('WHLD', 'Withhold'),
        ('NOVT', 'No vote'),
    )
    voted = models.CharField(max_length=4, choices=VOTE_TYPES, default='NOVT')
    person = models.ForeignKey(Person)
    voting = models.ForeignKey(Voting)