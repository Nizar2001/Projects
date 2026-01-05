from driver import Driver
from rider import Rider
from location import Location


def test_driver():
    location = Location(50, 100)
    driver = Driver("Nizar", location, 5)

    assert driver.id == "Nizar"
    assert driver.location == location
    assert driver.destination is None
    assert driver.is_idle is True
    assert driver.speed == 5
    assert str(driver) == "Nizar, (50, 100), 5, True"


def test_equality():
    location = Location(50, 100)
    driver1 = Driver("Nizar", location, 5)
    driver2 = Driver("Nizar", location, 10)
    assert driver1 == driver2


def test_travel_time():
    location = Location(50, 100)
    destination = Location(40, 70)
    driver = Driver("Nizar", location, 5)
    assert driver.get_travel_time(destination) == 8

    location = Location(50, 100)
    destination = Location(40, 70)
    driver = Driver("Nizar", location, 7)
    assert driver.get_travel_time(destination) == 6

    location = Location(10, 20)
    destination = Location(16, 18)
    driver = Driver("Nizar", location, 3)
    assert driver.get_travel_time(destination) == 3

    location = Location(7, 13)
    destination = Location(23, 50)
    driver = Driver("Nizar", location, 6)
    assert driver.get_travel_time(destination) == 9

    location = Location(500, 1000)
    destination = Location(40, 12)
    driver = Driver("Nizar", location, 13)
    assert driver.get_travel_time(destination) == 111


def test_drive():
    origin = Location(10, 15)
    destination = Location(16, 13)
    location = Location(3, 6)

    rider = Rider("Mehr", 10, origin, destination)
    driver = Driver("Nizar", location, 3)
    assert driver.destination is None

    time = driver.start_drive(rider.origin)
    assert driver.is_idle is False
    assert isinstance(driver.destination, Location)
    assert driver.destination == origin
    assert time == 5

    driver.end_drive()
    assert driver.is_idle
    assert driver.destination is None
    assert driver.location == origin

    time = driver.start_ride(rider)
    assert time == 3
    assert isinstance(driver.destination, Location)
    assert driver.destination == rider.destination
    assert driver.location == rider.origin

    driver.end_ride()
    assert rider.status == "satisfied"
    assert driver.destination is None
    assert driver.location == rider.destination
