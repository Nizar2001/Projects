from typing import List, Dict
from container import PriorityQueue
from dispatcher import Dispatcher
from event import Event, create_event_list
from monitor import Monitor
from simulation import Simulation
from location import Location
from event import RiderRequest, DriverRequest


def test_single_rider():
    simulation = Simulation()
    events = create_event_list("event0.txt")
    report = simulation.run(events)
    assert len(events) == 1
    r_lst = []
    d_lst = []
    for values in simulation._monitor._activities["rider"].values():
        for elements in values:
            r_lst.append(elements.description)

    for values in simulation._monitor._activities["driver"].values():
        for elements in values:
            d_lst.append(elements.description)

    assert r_lst == ["request", "cancel"] and d_lst == []

    rider = events[0]
    rider = rider.rider
    assert rider.status == "cancelled"


def test_patient():
    simulation = Simulation()
    events = create_event_list("event1.txt")
    report = simulation.run(events)
    assert len(events) == 2

    r_lst = []
    d_lst = []
    for values in simulation._monitor._activities["rider"].values():
        for elements in values:
            r_lst.append(elements.description)

    for values in simulation._monitor._activities["driver"].values():
        for elements in values:
            d_lst.append(elements.description)

    assert r_lst == ["request", "pickup"] and d_lst == ["request", "pickup",
                                                        "dropoff", "request"]

    assert report == {"rider_wait_time": 7.0,
                      "driver_total_distance": 27.0,
                      "driver_ride_distance": 13.0}

    driver = simulation._dispatcher._driver_lst[0]
    assert driver.destination is None
    l = Location(18, 15)
    assert driver.location == l
    assert driver.is_idle
    assert driver.id == "M"

    rider = events[0]
    assert isinstance(rider, RiderRequest)
    rider = rider.rider
    assert rider.status == "satisfied"


def test_impatient():
    simulation = Simulation()
    events = create_event_list("event2.txt")
    report = simulation.run(events)
    assert len(events) == 2

    r_lst = []
    d_lst = []
    for values in simulation._monitor._activities["rider"].values():
        for elements in values:
            r_lst.append(elements.description)

    for values in simulation._monitor._activities["driver"].values():
        for elements in values:
            d_lst.append(elements.description)

    assert r_lst == ["request", "cancel"] and d_lst == ["request", "request"]

    assert report == {"rider_wait_time": 6.0,
                      "driver_total_distance": 14.0,
                      "driver_ride_distance": 0.0}

    driver = events[1]
    assert isinstance(driver, DriverRequest)
    driver = driver.driver

    rider = events[0]
    assert isinstance(rider, RiderRequest)
    rider = rider.rider

    assert driver.location == rider.origin
    assert driver.destination is None
    assert driver.is_idle

    assert rider.status == "cancelled"
    assert rider.patience == 6
    assert len(simulation._dispatcher._driver_lst) == 1
    assert simulation._dispatcher._driver_lst[0] == driver
    assert len(simulation._dispatcher._rider_lst) == 0

    cancellation = simulation._monitor._activities["rider"]["N"]
    cancellation = cancellation[1]
    assert cancellation.id == "N"
    assert cancellation.location == rider.origin
    assert cancellation.description == "cancel"
    assert cancellation.time == 6

    r_request = simulation._monitor._activities["rider"]["N"]
    r_request = r_request[0]
    assert r_request.id == "N"
    assert r_request.location == rider.origin
    assert r_request.description == "request"
    assert r_request.time == 0

    d1_request = simulation._monitor._activities["driver"]["M"]
    d1_request = d1_request[0]
    assert d1_request.id == "M"
    assert d1_request.description == "request"
    l = Location(4, 2)
    assert d1_request.location == l
    assert d1_request.time == 0

    d2_request = simulation._monitor._activities["driver"]["M"]
    d2_request = d2_request[1]
    assert d2_request.id == "M"
    assert d2_request.description == "request"
    assert d2_request.time == 7
    assert d2_request.location == driver.location and d2_request.location == rider.origin


def test_2rider_1driver():
    simulation = Simulation()
    events = create_event_list("event3.txt")
    report = simulation.run(events)
    assert len(events) == 3

    r_lst = []
    d_lst = []
    for values in simulation._monitor._activities["rider"].values():
        for elements in values:
            r_lst.append(elements.description)

    for values in simulation._monitor._activities["driver"].values():
        for elements in values:
            d_lst.append(elements.description)

    assert r_lst == ["request", "pickup", "request", "cancel"]\
           and d_lst == ["request", "pickup", "dropoff", "request"]

    assert len(simulation._dispatcher._driver_lst) == 1
    assert len(simulation._dispatcher._rider_lst) == 0

    assert report == {"rider_wait_time": 7.0,
                      "driver_total_distance": 27.0,
                      "driver_ride_distance": 13.0}

    rider1 = events[0]
    assert isinstance(rider1, RiderRequest)
    rider1 = rider1.rider

    rider2 = events[1]
    assert isinstance(rider2, RiderRequest)
    rider2 = rider2.rider

    driver = events[2]
    assert isinstance(driver, DriverRequest)
    driver = driver.driver

    o1 = Location(13, 7)
    o2 = Location(10, 4)

    d1 = Location(18, 15)
    d2 = Location(4, 7)

    assert rider1.id == "Nizar"
    assert rider1.status == "satisfied"

    assert rider2.id == "Mehr"
    assert rider2.status == "cancelled"

    assert rider1.origin == o1 and rider1.destination == d1
    assert rider2.origin == o2 and rider2.destination == d2

    assert driver.location == rider1.destination
    assert driver.destination is None
    assert driver.is_idle

    n_activity = simulation._monitor._activities["rider"]["Nizar"]
    m_activity = simulation._monitor._activities["rider"]["Mehr"]
    a_activity = simulation._monitor._activities["driver"]["Ali"]

    assert len(n_activity) == 2

    assert n_activity[0].description == "request"
    assert n_activity[0].location == rider1.origin
    assert n_activity[0].id == "Nizar"
    assert n_activity[0].time == 0

    assert n_activity[1].description == "pickup"
    assert n_activity[1].location == rider1.origin
    assert n_activity[1].id == "Nizar"
    assert n_activity[1].time == 5

    assert len(m_activity) == 2

    assert m_activity[0].description == "request"
    assert m_activity[0].location == rider2.origin
    assert m_activity[0].id == "Mehr"
    assert m_activity[0].time == 0

    assert m_activity[1].description == "cancel"
    assert m_activity[1].location == rider2.origin
    assert m_activity[1].id == "Mehr"
    assert m_activity[1].time == 9

    assert len(a_activity) == 4
    assert a_activity[0].description == "request"
    l1 = Location(4, 2)
    assert a_activity[0].location == l1
    assert a_activity[0].id == "Ali"
    assert a_activity[0].time == 0

    assert a_activity[1].description == "pickup"
    assert a_activity[1].location == rider1.origin
    assert a_activity[1].id == "Ali"
    assert a_activity[1].time == 5

    assert a_activity[2].description == "dropoff"
    assert a_activity[2].location == rider1.destination
    assert a_activity[2].id == "Ali"
    assert a_activity[2].time == 9

    assert a_activity[3].description == "request"
    assert a_activity[3].location == rider1.destination
    assert a_activity[3].id == "Ali"
    assert a_activity[3].time == 9


def test_1driver_2rider():
    simulation = Simulation()
    events = create_event_list("event4.txt")
    report = simulation.run(events)
    assert len(events) == 3

    r_lst = []
    d_lst = []
    for values in simulation._monitor._activities["rider"].values():
        for elements in values:
            r_lst.append(elements.description)

    for values in simulation._monitor._activities["driver"].values():
        for elements in values:
            d_lst.append(elements.description)

    assert r_lst == ["request", "pickup", "request", "pickup"]
    assert d_lst == ["request", "pickup", "dropoff", "request",
                     "pickup", "dropoff", "request"]

    assert report == {"rider_wait_time": 7.5,
                      "driver_total_distance": 55.0,
                      "driver_ride_distance": 22.0}

    o1 = Location(13, 7)
    o2 = Location(10, 4)

    d1 = Location(18, 15)
    d2 = Location(4, 7)

    rider1 = events[0]
    assert isinstance(rider1, RiderRequest)
    rider1 = rider1.rider

    rider2 = events[1]
    assert isinstance(rider2, RiderRequest)
    rider2 = rider2.rider

    driver = events[2]
    assert isinstance(driver, DriverRequest)
    driver = driver.driver

    assert rider1.origin == o1
    assert rider1.destination == d1
    assert rider1.status == "satisfied"

    assert rider2.origin == o2
    assert rider2.destination == d2
    assert rider1.status == "satisfied"

    assert driver.location == rider2.destination
    assert driver.destination is None
    assert driver.is_idle
    assert driver.id == "Ali"

    n_activity = simulation._monitor._activities["rider"]["Nizar"]
    m_activity = simulation._monitor._activities["rider"]["Mehr"]
    a_activity = simulation._monitor._activities["driver"]["Ali"]

    assert len(n_activity) == 2

    assert n_activity[0].description == "request"
    assert n_activity[0].location == rider1.origin
    assert n_activity[0].id == "Nizar"
    assert n_activity[0].time == 3

    assert n_activity[1].description == "pickup"
    assert n_activity[1].location == rider1.origin
    assert n_activity[1].id == "Nizar"
    assert n_activity[1].time == 8

    assert len(m_activity) == 2

    assert m_activity[0].description == "request"
    assert m_activity[0].location == rider2.origin
    assert m_activity[0].id == "Mehr"
    assert m_activity[0].time == 8

    assert m_activity[1].description == "pickup"
    assert m_activity[1].location == rider2.origin
    assert m_activity[1].id == "Mehr"
    assert m_activity[1].time == 18

    assert len(a_activity) == 7
    assert a_activity[0].description == "request"
    l1 = Location(4, 2)
    assert a_activity[0].location == l1
    assert a_activity[0].id == "Ali"
    assert a_activity[0].time == 0

    assert a_activity[1].description == "pickup"
    assert a_activity[1].location == rider1.origin
    assert a_activity[1].id == "Ali"
    assert a_activity[1].time == 8

    assert a_activity[2].description == "dropoff"
    assert a_activity[2].location == rider1.destination
    assert a_activity[2].id == "Ali"
    assert a_activity[2].time == 12

    assert a_activity[3].description == "request"
    assert a_activity[3].location == rider1.destination
    assert a_activity[3].id == "Ali"
    assert a_activity[3].time == 12

    assert a_activity[4].description == "pickup"
    assert a_activity[4].location == rider2.origin
    assert a_activity[4].id == "Ali"
    assert a_activity[4].time == 18

    assert a_activity[5].description == "dropoff"
    assert a_activity[5].location == rider2.destination
    assert a_activity[5].id == "Ali"
    assert a_activity[5].time == 21

    assert a_activity[6].description == "request"
    assert a_activity[6].location == rider2.destination
    assert a_activity[6].id == "Ali"
    assert a_activity[6].time == 21


