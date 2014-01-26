import urllib2, time, sys
from django.core.management.base import BaseCommand, CommandError
from core.models import *

try:
    from lxml import etree

    print("running with lxml.etree")
except ImportError:
    try:
        # Python 2.5
        import xml.etree.cElementTree as etree

        print("running with cElementTree on Python 2.5+")
    except ImportError:
        try:
            # Python 2.5
            import xml.etree.ElementTree as etree

            print("running with ElementTree on Python 2.5+")
        except ImportError:
            try:
                # normal cElementTree install
                import cElementTree as etree

                print("running with cElementTree")
            except ImportError:
                try:
                    # normal ElementTree install
                    import elementtree.ElementTree as etree

                    print("running with ElementTree")
                except ImportError:
                    print("Failed to import ElementTree from any known place")


class Command(BaseCommand):
    help = 'Imports MP profiles'

    def handle(self, *args, **options):
        mp_id = 1
        failed = 0
        while True:
            try:
                xml = urllib2.urlopen('http://www.parliament.bg/export.php/bg/xml/MP/%s' % mp_id)
                tree = etree.XML(xml.read())
            except Exception, e:
                if failed == 2000:
                    print 'Too many failed. Exiting.'
                    exit()
                failed += 1
                continue
            else:
                failed = 0
            finally:
                mp_id += 1

            first_name = tree.find('Profile/Names/FirstName').get('value')
            middle_name = tree.find('Profile/Names/SirName').get('value')
            last_name = tree.find('Profile/Names/FamilyName').get('value')

            birthday = tree.find('Profile/DateOfBirth').get('value')
            hometown = tree.find('Profile/PlaceOfBirth').get('value')

            person, created = Person.objects.get_or_create(
                first_name=first_name,
                middle_name=middle_name,
                last_name=last_name
            )

            person.hometown = hometown
            person.birthday = self.parse_date(birthday)
            profession = ''
            for item in tree.find('Profile/Profession'):
                profession += item.get('value')
            person.profession = profession

            person.save()

            for activity in tree.find('ParliamentaryActivity'):
                if activity.tag == 'ParliamentaryStructure':
                    structure_name = activity.find('ParliamentaryStructureName').get('value')
                    structure_type = activity.find('ParliamentaryStructureType').get('value')

                    try:
                        structure, created = Structure.objects.get_or_create(
                            name=structure_name,
                            type=structure_type
                        )
                    except Exception, e:
                        self.stdout.write("%s %s - %s" % (e, structure_name, mp_id))

                    period_from = activity.find('ParliamentaryStructurePeriod/From').get('value')
                    period_to = activity.find('ParliamentaryStructurePeriod/To').get('value')
                    position = activity.find('ParliamentaryStructurePosition').get('value')

                    member = Member.objects.get_or_create(
                        person=person,
                        structure=structure,
                        date_from=self.parse_date(period_from),
                        date_to=self.parse_date(period_to),
                        position=position
                    )

    def parse_date(self, date):
        if date == '00/00/0000':
            return None
        try:
            date = date.split('/')
            return r"" + date[2]+'-'+date[1]+'-'+date[0]
        except:
            return None
