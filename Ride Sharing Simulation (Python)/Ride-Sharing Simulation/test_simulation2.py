from typing import List, Dict
from container import PriorityQueue
from dispatcher import Dispatcher
from event import Event, create_event_list
from monitor import Monitor
from simulation import Simulation
from location import Location, manhattan_distance
from event import RiderRequest, DriverRequest

from test_simulation import test_patient, test_impatient,\
    test_single_rider, test_1driver_2rider, test_2rider_1driver

test_impatient()
test_single_rider()
test_1driver_2rider()
test_2rider_1driver()
test_patient()


def test_2driver_1rider_p1():
    simulation = Simulation()
    events = create_event_list("event5.txt")
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

    assert r_lst == ["request", "pickup"] and\
           d_lst == ["request", "pickup", "dropoff", "request", "request"]

    assert report == {"rider_wait_time": 8.0,
                      "driver_total_distance": 11.5,
                      "driver_ride_distance": 4.5}

    o1 = Location(13, 7)
    d1 = Location(18, 11)

    rider = events[0]
    assert isinstance(rider, RiderRequest)

    rider = rider.rider
    assert rider.origin == o1
    assert rider.destination == d1
    assert rider.status == "satisfied"

    driver1 = events[1]
    assert isinstance(driver1, DriverRequest)
    driver1 = driver1.driver

    driver2 = events[2]
    assert isinstance(driver2, DriverRequest)
    driver2 = driver2.driver

    assert driver1.id == "Mehr"
    assert driver1.location == rider.destination
    assert driver1.destination is None
    assert driver1.is_idle

    assert driver2.id == "Ali"
    l = Location(7, 1)
    assert driver2.location == l
    assert driver2.destination is None
    assert driver2.is_idle

    n_activity = simulation._monitor._activities["rider"]["Nizar"]
    m_activity = simulation._monitor._activities["driver"]["Mehr"]
    a_activity = simulation._monitor._activities["driver"]["Ali"]

    assert len(n_activity) == 2

    assert n_activity[0].description == "request"
    assert n_activity[0].location == rider.origin
    assert n_activity[0].id == "Nizar"
    assert n_activity[0].time == 0

    assert n_activity[1].description == "pickup"
    assert n_activity[1].location == rider.origin
    assert n_activity[1].id == "Nizar"
    assert n_activity[1].time == 8

    assert len(m_activity) == 4

    assert m_activity[0].description == "request"
    l1 = Location(4, 2)
    assert m_activity[0].location == l1
    assert m_activity[0].id == "Mehr"
    assert m_activity[0].time == 1

    assert m_activity[1].description == "pickup"
    assert m_activity[1].location == rider.origin
    assert m_activity[1].id == "Mehr"
    assert m_activity[1].time == 8

    assert m_activity[2].description == "dropoff"
    assert m_activity[2].location == rider.destination
    assert m_activity[2].id == "Mehr"


def test_2driver_1rider_p2():
    simulation = Simulation()
    events = create_event_list("event6.txt")
    report = simulation.run(events)
    assert len(events) == 3

    o1 = Location(13, 7)
    d1 = Location(17, 11)

    rider = events[2]
    assert isinstance(rider, RiderRequest)
    rider = rider.rider

    assert rider.status == "satisfied"
    assert rider.origin == o1
    assert rider.destination == d1

    driver1 = events[1]
    assert isinstance(driver1, DriverRequest)
    driver1 = driver1.driver

    driver2 = events[0]
    assert isinstance(driver2, DriverRequest)
    driver2 = driver2.driver

    assert driver1.id == "Mehr"
    l = Location(4, 2)
    assert driver1.location == l
    assert driver1.destination is None
    assert driver1.is_idle

    assert driver2.id == "Ali"
    assert driver2.location == rider.destination
    assert driver2.destination is None
    assert driver2.is_idle

    n_activity = simulation._monitor._activities["rider"]["Nizar"]
    m_activity = simulation._monitor._activities["driver"]["Mehr"]
    a_activity = simulation._monitor._activities["driver"]["Ali"]

    assert len(n_activity) == 2

    assert n_activity[0].description == "request"
    assert n_activity[0].location == rider.origin
    assert n_activity[0].id == "Nizar"
    assert n_activity[0].time == 3

    assert n_activity[1].description == "pickup"
    assert n_activity[1].location == rider.origin
    assert n_activity[1].id == "Nizar"
    assert n_activity[1].time == 7

    assert len(m_activity) == 1

    assert m_activity[0].description == "request"
    l1 = Location(4, 2)
    assert m_activity[0].location == l1
    assert m_activity[0].id == "Mehr"
    assert m_activity[0].time == 0

    assert len(a_activity) == 4
    assert a_activity[0].description == "request"
    l1 = Location(7, 1)
    assert a_activity[0].location == l1
    assert a_activity[0].id == "Ali"
    assert a_activity[0].time == 2

    assert a_activity[1].description == "pickup"
    assert a_activity[1].location == rider.origin
    assert a_activity[1].id == "Ali"
    assert a_activity[1].time == 7

    assert a_activity[2].description == "dropoff"
    assert a_activity[2].location == rider.destination
    assert a_activity[2].id == "Ali"
    assert a_activity[2].time == 10

    assert a_activity[3].description == "request"
    assert a_activity[3].location == rider.destination
    assert a_activity[3].id == "Ali"
    assert a_activity[3].time == 10
    rider_lst = simulation._dispatcher._rider_lst
    driver_lst = simulation._dispatcher._driver_lst
    assert (len(rider_lst) == 0) and len(driver_lst) == 2

    lst = []
    for elements in driver_lst:
        lst.append(elements.id)
    assert lst == ["Mehr", "Ali"]


def test_multiple_riders_multiple_drivers_p1():
    simulation = Simulation()
    events = create_event_list("event7.txt")
    report = simulation.run(events)
    assert len(events) == 4

    r_lst = []
    d_lst = []
    for values in simulation._monitor._activities["rider"].values():
        for elements in values:
            r_lst.append(elements.description)

    for values in simulation._monitor._activities["driver"].values():
        for elements in values:
            d_lst.append(elements.description)

    assert r_lst == ["request", "pickup", "request", "pickup"] and \
           d_lst == ["request", "pickup", "dropoff", "request",
                     "request", "pickup", "dropoff", "request"]

    assert report == {"rider_wait_time": 6.0,
                      "driver_total_distance": 26.0,
                      "driver_ride_distance": 12.0}

    driver1 = events[0]
    assert isinstance(driver1, DriverRequest)
    driver1 = driver1.driver

    driver2 = events[1]
    assert isinstance(driver2, DriverRequest)
    driver2 = driver2.driver

    rider1 = events[2]
    assert isinstance(rider1, RiderRequest)
    rider1 = rider1.rider

    rider2 = events[3]
    assert isinstance(rider2, RiderRequest)
    rider2 = rider2.rider

    o1 = Location(13, 7)
    o2 = Location(8, 14)

    d1 = Location(17, 11)
    d2 = Location(13, 3)

    assert driver1.id == "Ali"
    assert driver1.location == rider1.destination
    assert driver1.destination is None
    assert driver1.is_idle

    assert driver2.id == "Mehr"
    assert driver2.location == rider2.destination
    assert driver2.destination is None
    assert driver2.is_idle

    assert rider1.id == "Nizar"
    assert rider1.status == "satisfied"
    assert rider1.origin == o1
    assert rider1.destination == d1

    assert rider2.id == "Anwar"
    assert rider2.status == "satisfied"
    assert rider2.origin == o2
    assert rider2.destination == d2

    n_activity = simulation._monitor._activities["rider"]["Nizar"]
    an_activity = simulation._monitor._activities["rider"]["Anwar"]
    m_activity = simulation._monitor._activities["driver"]["Mehr"]
    a_activity = simulation._monitor._activities["driver"]["Ali"]

    assert len(n_activity) == 2

    assert n_activity[0].description == "request"
    assert n_activity[0].id == "Nizar"
    assert n_activity[0].time == 3
    assert n_activity[0].location == rider1.origin

    assert n_activity[1].description == "pickup"
    assert n_activity[1].location == rider1.origin
    assert n_activity[1].id == "Nizar"
    assert n_activity[1].time == 7

    assert len(a_activity) == 4
    assert a_activity[0].description == "request"
    l1 = Location(7, 1)
    assert a_activity[0].location == l1
    assert a_activity[0].id == "Ali"
    assert a_activity[0].time == 2

    assert a_activity[1].description == "pickup"
    assert a_activity[1].location == rider1.origin
    assert a_activity[1].id == "Ali"
    assert a_activity[1].time == 7

    assert a_activity[2].description == "dropoff"
    assert a_activity[2].location == rider1.destination
    assert a_activity[2].id == "Ali"
    assert a_activity[2].time == 10

    assert a_activity[3].description == "request"
    assert a_activity[3].location == rider1.destination
    assert a_activity[3].id == "Ali"
    assert a_activity[3].time == 10

    assert len(m_activity) == 4
    assert m_activity[0].description == "request"
    l1 = Location(4, 2)
    assert m_activity[0].location == l1
    assert m_activity[0].id == "Mehr"
    assert m_activity[0].time == 0

    assert m_activity[1].description == "pickup"
    assert m_activity[1].location == rider2.origin
    assert m_activity[1].id == "Mehr"
    assert m_activity[1].time == 14

    assert m_activity[2].description == "dropoff"
    assert m_activity[2].location == rider2.destination
    assert m_activity[2].id == "Mehr"
    assert m_activity[2].time == 22

    assert m_activity[3].description == "request"
    assert m_activity[3].location == rider2.destination
    assert m_activity[3].id == "Mehr"
    assert m_activity[3].time == 22

    assert an_activity[0].description == "request"
    assert an_activity[0].id == "Anwar"
    assert an_activity[0].time == 6
    assert an_activity[0].location == rider2.origin

    assert an_activity[1].description == "pickup"
    assert an_activity[1].id == "Anwar"
    assert an_activity[1].time == 14
    assert an_activity[1].location == rider2.origin
    assert len(simulation._dispatcher._driver_lst) == 2
    lst = []
    for elements in simulation._dispatcher._driver_lst:
        lst.append(elements.id)
    assert lst == ["Ali", "Mehr"]


def test_multiple_riders_multiple_drivers_p2():
    simulation = Simulation()
    events = create_event_list("event8.txt")
    report = simulation.run(events)
    assert len(events) == 9

    r_lst = []
    d_lst = []
    for values in simulation._monitor._activities["rider"].values():
        for elements in values:
            r_lst.append(elements.description)

    for values in simulation._monitor._activities["driver"].values():
        for elements in values:
            d_lst.append(elements.description)

    assert r_lst == ["request", "pickup", "request", "pickup",
                     "request", "pickup", "request", "cancel"]

    assert report == {"rider_wait_time": 1.50,
                      "driver_total_distance": 11.0,
                      "driver_ride_distance": 6.2}

    nizar = events[0]
    assert isinstance(nizar, RiderRequest)
    nizar = nizar.rider

    mehr = events[1]
    assert isinstance(mehr, RiderRequest)
    mehr = mehr.rider

    ahmad = events[2]
    assert isinstance(ahmad, RiderRequest)
    ahmad = ahmad.rider

    mark = events[3]
    assert isinstance(mark, RiderRequest)
    mark = mark.rider

    john = events[4]
    assert isinstance(john, DriverRequest)
    john = john.driver

    zabi = events[5]
    assert isinstance(zabi, DriverRequest)
    zabi = zabi.driver

    ali = events[6]
    assert isinstance(ali, DriverRequest)
    ali = ali.driver

    james = events[7]
    assert isinstance(james, DriverRequest)
    james = james.driver

    ted = events[8]
    assert isinstance(ted, DriverRequest)
    ted = ted.driver

    o1 = Location(13, 7)
    o2 = Location(4, 9)
    o3 = Location(2, 12)
    o4 = Location(20, 1)

    d1 = Location(18, 11)
    d2 = Location(13, 4)
    d3 = Location(9, 13)
    d4 = Location(10, 11)

    assert nizar.origin == o1 and nizar.destination == d1
    assert mehr.origin == o2 and mehr.destination == d2
    assert ahmad.origin == o3 and ahmad.destination == d3
    assert mark.origin == o4 and mark.destination == d4

    assert john.id == "John"
    assert john.location == ahmad.destination
    assert john.is_idle
    assert john.destination is None

    assert zabi.id == "Zabi"
    l = Location(4, 3)
    assert zabi.location == l
    assert zabi.destination is None
    assert zabi.is_idle

    assert ali.location == mark.origin
    assert ali.destination is None
    assert ali.id == "Ali"
    assert ali.is_idle

    assert james.id == "James"
    assert james.location == mehr.destination
    assert james.destination is None
    assert james.is_idle

    assert ted.id == "Ted"
    assert ted.location == nizar.destination
    assert ted.is_idle
    assert ted.destination is None

    assert nizar.status == "satisfied"
    assert mehr.status == "satisfied"
    assert ahmad.status == "satisfied"
    assert mark.status == "cancelled"

    nizar_activity = simulation._monitor._activities["rider"]["Nizar"]
    mehr_activity = simulation._monitor._activities["rider"]["Mehr"]
    ahmad_activity = simulation._monitor._activities["rider"]["Ahmad"]
    mark_activity = simulation._monitor._activities["rider"]["Mark"]
    john_activity = simulation._monitor._activities["driver"]["John"]
    zabi_activity = simulation._monitor._activities["driver"]["Zabi"]
    ali_activity = simulation._monitor._activities["driver"]["Ali"]
    james_activity = simulation._monitor._activities["driver"]["James"]
    ted_activity = simulation._monitor._activities["driver"]["Ted"]

    assert len(zabi_activity) == 1
    assert zabi_activity[0].description == "request"
    l1 = Location(4,3)
    assert zabi_activity[0].location == l1
    assert zabi_activity[0].time == 0
    assert zabi_activity[0].id == "Zabi"

    assert len(ali_activity) == 2
    assert ali_activity[0].description == "request"
    l2 = Location(7,1)
    assert ali_activity[0].location == l2
    assert ali_activity[0].time == 0
    assert ali_activity[0].id == "Ali"

    assert ali_activity[1].description == "request"
    assert ali_activity[1].location == mark.origin
    assert ali_activity[1].time == 11
    assert ali_activity[1].id == "Ali"

    assert len(john_activity) == 4
    assert john_activity[0].description == "request"
    l3 = Location(2,13)
    assert john_activity[0].location == l3
    assert john_activity[0].time == 1
    assert john_activity[0].id == "John"

    assert john_activity[1].description == "pickup"
    assert john_activity[1].location == ahmad.origin
    assert john_activity[1].time == 7
    assert john_activity[1].id == "John"

    assert john_activity[2].description == "dropoff"
    assert john_activity[2].location == ahmad.destination
    assert john_activity[2].time == 10
    assert john_activity[2].id == "John"

    assert john_activity[3].description == "request"
    assert john_activity[3].location == ahmad.destination
    assert john_activity[3].time == 10
    assert john_activity[3].id == "John"

    assert len(james_activity) == 4

    assert james_activity[0].description == "request"
    l4 = Location(5,9)
    assert james_activity[0].location == l4
    assert james_activity[0].time == 5
    assert james_activity[0].id == "James"

    assert james_activity[1].description == "pickup"
    assert james_activity[1].location == mehr.origin
    assert james_activity[1].time == 6
    assert james_activity[1].id == "James"

    assert james_activity[2].description == "dropoff"
    assert james_activity[2].location == mehr.destination
    assert james_activity[2].time == 9
    assert james_activity[2].id == "James"

    assert james_activity[3].description == "request"
    assert james_activity[3].location == mehr.destination
    assert james_activity[3].time == 9
    assert james_activity[3].id == "James"

    assert len(ted_activity) == 4
    l5 = Location(14,15)
    assert ted_activity[0].description == "request"
    assert ted_activity[0].location == l5
    assert ted_activity[0].time == 2
    assert ted_activity[0].id == "Ted"

    assert ted_activity[1].description == "pickup"
    assert ted_activity[1].location == nizar.origin
    assert ted_activity[1].time == 7
    assert ted_activity[1].id == "Ted"

    assert ted_activity[2].description == "dropoff"
    assert ted_activity[2].location == nizar.destination
    assert ted_activity[2].time == 10
    assert ted_activity[2].id == "Ted"

    assert ted_activity[3].description == "request"
    assert ted_activity[3].location == nizar.destination
    assert ted_activity[3].time == 10
    assert ted_activity[3].id == "Ted"

    assert len(nizar_activity) == 2
    assert nizar_activity[0].description == "request"
    assert nizar_activity[0].location == nizar.origin
    assert nizar_activity[0].time == 4
    assert nizar_activity[0].id == "Nizar"

    assert nizar_activity[1].description == "pickup"
    assert nizar_activity[1].location == nizar.origin
    assert nizar_activity[1].time == 7
    assert nizar_activity[1].id == "Nizar"

    assert len(mehr_activity) == 2
    assert mehr_activity[0].description == "request"
    assert mehr_activity[0].location == mehr.origin
    assert mehr_activity[0].time == 6
    assert mehr_activity[0].id == "Mehr"

    assert mehr_activity[1].description == "pickup"
    assert mehr_activity[1].location == mehr.origin
    assert mehr_activity[1].time == 6
    assert mehr_activity[1].id == "Mehr"

    assert len(mehr_activity) == 2
    assert mehr_activity[0].description == "request"
    assert mehr_activity[0].location == mehr.origin
    assert mehr_activity[0].time == 6
    assert mehr_activity[0].id == "Mehr"

    assert len(ahmad_activity) == 2
    assert ahmad_activity[0].description == "request"
    assert ahmad_activity[0].location == ahmad.origin
    assert ahmad_activity[0].time == 7
    assert ahmad_activity[0].id == "Ahmad"

    assert ahmad_activity[1].description == "pickup"
    assert ahmad_activity[1].location == ahmad.origin
    assert ahmad_activity[1].time == 7
    assert ahmad_activity[1].id == "Ahmad"

    assert len(mark_activity) == 2
    assert mark_activity[0].description == "request"
    assert mark_activity[0].location == mark.origin
    assert mark_activity[0].time == 7
    assert mark_activity[0].id == "Mark"

    assert mark_activity[1].description == "cancel"
    assert mark_activity[1].location == mark.origin
    assert mark_activity[1].time == 10
    assert mark_activity[1].id == "Mark"

    lst = []
    for elements in simulation._dispatcher._driver_lst:
        lst.append(elements.id)

    assert lst == ["Zabi", "James", "Ted", "John", "Ali"]

    assert simulation._dispatcher._rider_lst == []

    l1 = Location(20, 1)
    l2 = Location(4, 3)
    assert manhattan_distance(l1, l2) == 18
