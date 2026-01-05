from dispatcher import Dispatcher
from driver import Driver
from rider import Rider
from location import Location


def test_request_rider():
    o1 = Location(4, 10)
    o2 = Location(6, 16)
    o3 = Location(17, 3)
    o4 = Location(39, 13)
    o5 = Location(2, 43)
    o6 = Location(21, 32)
    o7 = Location(15, 20)

    d1 = Location(31, 9)
    d2 = Location(23, 12)
    d3 = Location(19, 9)
    d4 = Location(16, 73)
    d5 = Location(28, 24)
    d6 = Location(46, 7)
    d7 = Location(8, 21)

    l1 = Location(17, 9)
    l2 = Location(23, 12)
    l3 = Location(31, 54)
    l4 = Location(23, 71)
    l5 = Location(8, 13)
    l6 = Location(37, 55)
    l7 = Location(17, 57)

    rider1 = Rider("A", 10, o1, d1)
    rider2 = Rider("B", 15, o2, d2)
    rider3 = Rider("C", 12, o3, d3)
    rider4 = Rider("D", 23, o4, d4)
    rider5 = Rider("E", 17, o5, d5)
    rider6 = Rider("F", 8, o6, d6)
    rider7 = Rider("G", 19, o7, d7)

    driver1 = Driver("a", l1, 2)
    driver2 = Driver("b", l2, 3)
    driver3 = Driver("c", l3, 3)
    driver4 = Driver("d", l4, 4)
    driver5 = Driver("e", l5, 2)
    driver6 = Driver("f", l6, 1)
    driver7 = Driver("g", l7, 2)

    dispatcher = Dispatcher()
    r1 = dispatcher.request_driver(rider1)
    r2 = dispatcher.request_driver(rider2)
    r3 = dispatcher.request_driver(rider3)
    r4 = dispatcher.request_driver(rider4)
    r5 = dispatcher.request_driver(rider5)
    r6 = dispatcher.request_driver(rider6)
    r7 = dispatcher.request_driver(rider7)
    drivers = (r1, r2, r3, r4, r5, r6, r7)
    for i in drivers:
        assert i is None

    dispatcher = Dispatcher()
    d0 = dispatcher.request_rider(driver4)
    r1 = dispatcher.request_driver(rider1)
    r2 = dispatcher.request_driver(rider2)
    d1 = dispatcher.request_rider(driver1)
    d2 = dispatcher.request_rider(driver7)
    d3 = dispatcher.request_rider(driver3)
    r3 = dispatcher.request_driver(rider3)
    r4 = dispatcher.request_driver(rider4)
    d4 = dispatcher.request_rider(driver5)
    r5 = dispatcher.request_driver(rider5)
    r6 = dispatcher.request_driver(rider6)
    d5 = dispatcher.request_rider(driver2)
    r7 = dispatcher.request_driver(rider7)
    d6 = dispatcher.request_rider(driver6)

    assert d0 is None
    assert r1 == driver4
    assert r2 is None
    assert d1 == rider2
    assert d2 is None
    assert d3 is None
    assert r3 == driver3
    assert r4 == driver7
    assert d4 is None
    assert r5 == driver5
    assert r6 is None
    assert d5 == rider6
    assert r7 is None
    assert d6 == rider7


def test_request_driver():
    o1 = Location(4, 10)
    o2 = Location(6, 16)
    o3 = Location(17, 3)
    o4 = Location(39, 13)
    o5 = Location(2, 43)
    o6 = Location(21, 32)
    o7 = Location(15, 20)

    d1 = Location(31, 9)
    d2 = Location(23, 12)
    d3 = Location(19, 9)
    d4 = Location(28, 24)
    d5 = Location(16, 73)
    d6 = Location(46, 7)
    d7 = Location(8, 21)

    l1 = Location(17, 9)
    l2 = Location(23, 12)
    l3 = Location(31, 54)
    l4 = Location(23, 71)
    l5 = Location(8, 13)
    l6 = Location(37, 55)
    l7 = Location(17, 57)

    rider1 = Rider("A", 10, o1, d1)
    rider2 = Rider("B", 15, o2, d2)
    rider3 = Rider("C", 12, o3, d3)
    rider4 = Rider("D", 23, o4, d4)
    rider5 = Rider("E", 17, o5, d5)
    rider6 = Rider("F", 8, o6, d6)
    rider7 = Rider("G", 19, o7, d7)

    driver1 = Driver("a", l1, 2)
    driver2 = Driver("b", l2, 3)
    driver3 = Driver("c", l3, 3)
    driver4 = Driver("d", l4, 4)
    driver5 = Driver("e", l5, 2)
    driver6 = Driver("f", l6, 1)
    driver7 = Driver("g", l7, 2)

    dispatcher = Dispatcher()
    r4 = dispatcher.request_rider(driver4)
    r5 = dispatcher.request_rider(driver5)
    r6 = dispatcher.request_rider(driver6)
    r7 = dispatcher.request_rider(driver7)
    r1 = dispatcher.request_rider(driver1)
    r2 = dispatcher.request_rider(driver2)
    r3 = dispatcher.request_rider(driver3)

    d1 = dispatcher.request_driver(rider1)
    d2 = dispatcher.request_driver(rider2)
    d3 = dispatcher.request_driver(rider3)
    d4 = dispatcher.request_driver(rider4)
    d5 = dispatcher.request_driver(rider5)
    d6 = dispatcher.request_driver(rider6)
    d7 = dispatcher.request_driver(rider7)

    drivers = (r1, r2, r3, r4, r5, r6, r7)
    for i in drivers:
        assert i is None

    assert d1 == driver5
    assert d2 == driver2
    assert d3 == driver1
    assert d4 == driver3
    assert d5 == driver4
    assert d6 == driver7
    assert d7 == driver6


def test_request_driver_same_time():
    o1 = Location(5, 10)
    d1 = Location(10, 15)

    l1 = Location(10, 18)
    l2 = Location(0, 5)

    rider1 = Rider("Josh", 10, o1, d1)

    driver1 = Driver("Nizar", l1, 5)
    driver2 = Driver("Mehr", l2, 5)

    dispatcher = Dispatcher()
    v1 = dispatcher.request_rider(driver1)
    v2 = dispatcher.request_rider(driver2)
    d1 = dispatcher.request_driver(rider1)

    assert v1 is None and v2 is None
    assert d1 == driver2


def test_dispatcher_cancel():
    o1 = Location(4, 10)
    o2 = Location(6, 16)
    o3 = Location(17, 3)
    o4 = Location(39, 13)

    d1 = Location(31, 9)
    d2 = Location(23, 12)
    d3 = Location(19, 9)
    d4 = Location(28, 24)

    l1 = Location(17, 9)
    l2 = Location(23, 12)
    l3 = Location(31, 34)
    l4 = Location(23, 41)

    rider1 = Rider("A", 5, o1, d1)
    rider2 = Rider("B", 5, o2, d2)
    rider3 = Rider("C", 5, o3, d3)
    rider4 = Rider("D", 5, o4, d4)

    driver1 = Driver("a", l1, 3)
    driver2 = Driver("b", l2, 2)
    driver3 = Driver("c", l3, 4)
    driver4 = Driver("d", l4, 3)

    rider_lst = [rider1, rider2, rider3, rider4]

    dispatcher = Dispatcher()

    y1 = dispatcher.request_rider(driver1)
    y2 = dispatcher.request_rider(driver2)
    y3 = dispatcher.request_rider(driver3)
    y4 = dispatcher.request_rider(driver4)

    x1 = dispatcher.request_driver(rider1)
    assert dispatcher._driver_lst == [driver2, driver3, driver4]

    x3 = dispatcher.request_driver(rider3)
    x4 = dispatcher.request_driver(rider4)
    x2 = dispatcher.request_driver(rider2)

    assert x1 == driver1 and x3 == driver2 and x4 == driver3 and x2 == driver4
    assert dispatcher._driver_lst == []
    print(len(dispatcher._rider_lst))

    x1 = dispatcher.request_driver(rider1)
    x3 = dispatcher.request_driver(rider3)
    x4 = dispatcher.request_driver(rider4)
    x2 = dispatcher.request_driver(rider2)

    dispatcher.cancel_ride(rider4)
    dispatcher.cancel_ride(rider1)
    dispatcher.cancel_ride(rider3)
    assert dispatcher._rider_lst == [rider2]

