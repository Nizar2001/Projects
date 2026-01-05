"""Locations for the simulation"""

from __future__ import annotations


class Location:
    """A two-dimensional location.
    === Attributes ===
    row: The vertical distance from the bottom of the grid
    column: The vertical distance from the left of the grid
    """
    row: int
    column: int

    def __init__(self, row: int, column: int) -> None:
        """Initialize a location.

        """
        self.row = row
        self.column = column

    def __str__(self) -> str:
        """Return a string representation.

        >>> l = Location(4, 7)
        >>> print(l)
        (4, 7)
        """
        return str((self.row, self.column))

    def __eq__(self, other: Location) -> bool:
        """Return True if self equals other, and false otherwise.

        >>> my_location = Location(4, 6)
        >>> your_location = Location(5, 9)
        >>> my_location == your_location
        False
        >>> location1 = Location(10, 23)
        >>> location2 = Location(10, 23)
        >>> location1 == location2
        True
        >>> location1 = Location(7, 17)
        >>> location2 = Location(17, 7)
        >>> location1 == location2
        False
        """
        result = self.row == other.row and self.column == other.column
        return result


def manhattan_distance(origin: Location, destination: Location) -> int:
    """Return the Manhattan distance between the origin and the destination.

    >>> location1 = Location(9, 13)
    >>> location2 = Location(5, 18)
    >>> manhattan_distance(location1, location2)
    9
    >>> l1 = Location(2, 4)
    >>> l2 = Location(5, 8)
    >>> manhattan_distance(l1, l2)
    7
    """
    v_distance = abs(origin.row - destination.row)
    h_distance = abs(origin.column - destination.column)

    return v_distance + h_distance


def deserialize_location(location_str: str) -> Location:
    """Deserialize a location.

    location_str: A location in the format 'row,col'

    """
    string_lst = location_str.split(",")
    row = int(string_lst[0])
    column = int(string_lst[1])
    location = Location(row, column)
    return location


if __name__ == '__main__':
    import python_ta
    python_ta.check_all()
