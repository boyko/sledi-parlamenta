from models import *


class MpsService():
    def get_by_parties(self, parties):
        if len(parties)==0:
            return MP.objects.all()

        # check if the provided parties are valid
        if MP.check_type(*parties) > 0:
            raise Exception("Invalid political party")

        return MP.objects.filter(party__in=parties)