from location import Location, manhattan_distance, deserialize_location
import pytest

from hypothesis import given
from hypothesis.strategies import integers


@given(integers(), integers(), integers(), integers())
def test_manhattan(n1: int, n2: int, n3: int, n4: int):
    location1 = Location(n1, n2)
    location2 = Location(n3, n4)
    assert manhattan_distance(location1, location2) >= 0


def test_location():
    location1 = Location(2, 5)

    assert location1.row == 2
    assert location1.column == 5
    assert str(location1) == "(2, 5)"

    location2 = Location(5, 7)
    assert location2.row == 5
    assert location2.column == 7
    assert str(location2) == "(5, 7)"

    assert (location1 == location2) is False

    location3 = Location(5, 7)

    assert (location3 == location1) is False
    assert location3 == location2

    location4 = Location(20000000, 5000000)
    assert (location4 == location1) is False
    assert str(location4) == "(20000000, 5000000)"

    location5 = Location(5, 6)
    assert (location5 == location2) is False

    location6 = Location(6, 7)
    assert (location6 == location2) is False

    location7 = Location(6, 8)
    assert (location7 == location2) is False


def test_manhattan_distance():
    location1 = Location(2, 5)
    location2 = Location(7, 9)
    assert manhattan_distance(location1, location2) == 9

    location1 = Location(8, 7)
    location2 = Location(8, 8)
    assert manhattan_distance(location1, location2) == 1

    location1 = Location(5, 5)
    location2 = Location(5, 5)
    assert manhattan_distance(location1, location2) == 0

    location1 = Location(4, 6)
    location2 = Location(6, 8)
    assert manhattan_distance(location1, location2) == 4

    location1 = Location(8, 10)
    location2 = Location(10, 8)
    assert manhattan_distance(location1, location2) == 4

    location1 = Location(10000, 30000)
    location2 = Location(5000, 15000)
    assert manhattan_distance(location1, location2) == 20000

    location1 = Location(234, 123)
    location2 = Location(732, 92)
    assert manhattan_distance(location1, location2) == 529

    location1 = Location(4, 10)
    location2 = Location(6, 8)
    assert manhattan_distance(location1, location2) == 4

    location1 = Location(9, 10)
    location2 = Location(3, 15)
    assert manhattan_distance(location1, location2) == 11


def test_deserialize():
    location1 = deserialize_location("732,123")
    location2 = deserialize_location("234,92")
    assert manhattan_distance(location1, location2) == 529

    location1 = deserialize_location("2,76")
    location2 = deserialize_location("17,24")
    assert manhattan_distance(location1, location2) == 67

    location1 = deserialize_location("10000000,50000000")
    location2 = deserialize_location("0, 10000000")
    assert manhattan_distance(location1, location2) == 50000000


@given(integers(), integers())
def test_des(n1: int, n2: int):
    assert isinstance(deserialize_location(f"{n1},{n2}"), Location)

