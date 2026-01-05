from Assignment.rider import Rider
from Assignment.location import Location


def test_rider():
    origin = Location(6, 8)
    destination = Location(5, 7)
    rider = Rider("Nizar", 10, origin, destination)
    assert rider.id == "Nizar"
    assert rider.status == "waiting"
    rider.satisfy()
    assert rider.status == "satisfied"
    rider.cancel()
    assert rider.status == "cancelled"

    assert str(rider.destination) == "(5, 7)"
    assert str(rider.origin) == "(6, 8)"
