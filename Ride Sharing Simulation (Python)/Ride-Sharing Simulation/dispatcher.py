

"""Dispatcher for the simulation"""

from typing import Optional
from driver import Driver
from rider import Rider


class Dispatcher:
    """A dispatcher fulfills requests from riders and drivers for a
    ride-sharing service.

    When a rider requests a driver, the dispatcher assigns a driver to the
    rider. If no driver is available, the rider is placed on a waiting
    list for the next available driver. A rider that has not yet been
    picked up by a driver may cancel their request.

    When a driver requests a rider, the dispatcher assigns a rider from
    the waiting list to the driver. If there is no rider on the waiting list
    the dispatcher does nothing. Once a driver requests a rider, the driver
    is registered with the dispatcher, and will be used to fulfill future
    rider requests.
    """
    # === Private Attributes ===
    #     _rider_list: A list of riders waiting for a ride
    #     _driver_list: A list of drivers waiting for a rider
    #     _registered_driver: A list of registered driver in this dispatcher
    _rider_lst: list
    _driver_lst: list
    _registered_driver: list

    def __init__(self) -> None:
        """Initialize a Dispatcher.

        """
        self._rider_lst = []
        self._driver_lst = []
        self._registered_driver = []

    def __str__(self) -> str:
        """Return a string representation.

        """
        rider_list = []
        driver_list = []
        for rider in range(len(self._rider_lst)):
            rider_list.append(self._rider_lst[rider].id)

        for driver in range(len(self._driver_lst)):
            driver_list.append(self._driver_lst[driver].id)

        return f"({rider_list}, {driver_list})"

    def request_driver(self, rider: Rider) -> Optional[Driver]:
        """Return a driver for the rider, or None if no driver is available.

        Add the rider to the waiting list if there is no available driver.
        """
        if not self._driver_lst:
            self._rider_lst.append(rider)
            return None
        else:
            time_dict = {}
            for driver in self._driver_lst:
                time_taken = driver.get_travel_time(rider.origin)
                if time_taken not in time_dict:
                    time_dict[time_taken] = [driver]
                else:
                    time_dict[time_taken].append(driver)

            minimum = min(time_dict)
            found_driver = time_dict[minimum].pop(0)
            if len(time_dict[minimum]) == 0:
                time_dict.pop(minimum)
            self._driver_lst.remove(found_driver)
            return found_driver

    def request_rider(self, driver: Driver) -> Optional[Rider]:
        """Return a rider for the driver, or None if no rider is available.

        If this is a new driver, register the driver for future rider requests.

        """
        if not self._rider_lst:
            self._driver_lst.append(driver)
        else:
            return self._rider_lst.pop(0)

        if driver not in self._registered_driver:
            self._registered_driver.append(driver)

        return None

    def cancel_ride(self, rider: Rider) -> None:
        """Cancel the ride for rider.

        """
        if rider in self._rider_lst:
            self._rider_lst.remove(rider)
        rider.cancel()


if __name__ == '__main__':
    import python_ta
    python_ta.check_all(config={'extra-imports': ['typing', 'driver', 'rider']})
