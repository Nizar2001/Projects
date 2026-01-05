from dispatcher import Dispatcher
from driver import Driver
from rider import Rider
from location import Location
from dispatcher import Dispatcher
from monitor import Activity
from monitor import Monitor


def test_monitor():
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

    monitor = Monitor()

    monitor.notify(3, "driver", "request", "a", l1)
    monitor.notify(3, "driver", "request", "b", l2)
    monitor.notify(4, "driver", "request", "c", l3)
    monitor.notify(5, "rider", "request", "A", o1)
    monitor.notify(10, "driver", "pickup", "a", o1)
    monitor.notify(10, "rider", "pickup", "A", o1)
    monitor.notify(12, "driver", "dropoff", "a", d1)

    assert monitor.report() == {"rider_wait_time": 5.0,
                                "driver_total_distance": 14.0,
                                "driver_ride_distance": 9.3333333333333333}

    da1 = Activity(3, "request", "a", l1)
    da2 = Activity(4, "request", "b", l2)
    da3 = Activity(5, "request", "c", l3)
    da1 = Activity(6, "request", "d", l4)
