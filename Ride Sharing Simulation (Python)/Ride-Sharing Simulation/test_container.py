from container import PriorityQueue


class Num:
    def __init__(self, id_, value):
        self.id = id_
        self.value = value

    def __eq__(self, other):
        return self.value == other.value

    def __lt__(self, other):
        return self.value < other.value

    def __le__(self, other):
        return self.value <= other.value

    def __gt__(self, other):
        return self.value > other.value

    def __ge__(self, other):
        return self.value >= other.value


def test_priority_queue():
    queue = PriorityQueue()
    queue.add(7)
    queue.add(9)
    queue.add(3)
    queue.add(0)
    queue.add(5)

    lst = []
    while not queue.is_empty():
        lst.append(queue.remove())

    assert lst == [0, 3, 5, 7, 9]

    lst2 = []
    queue1 = PriorityQueue()
    queue1.add(5)
    queue1.add(-10)
    queue1.add(5.9)
    while not queue1.is_empty():
        lst2.append(queue1.remove())

    assert lst2 == [-10, 5, 5.9]

    queue2 = PriorityQueue()
    queue2.add(Num("A", -2))
    queue2.add(Num("B", -2))
    queue2.add(Num("C", 1))
    queue2.add(Num("D", -2))
    queue2.add(Num("E", 0))
    queue2.remove()
    queue2.remove()
    queue2.remove()
    value = queue2.remove()
    assert value.id == "E"
    queue2.remove()

    assert queue2.is_empty()

    queue3 = PriorityQueue()
    queue3.add(Num("a", 10))
    queue3.add(Num("b", 15))
    queue3.add(Num("c", 0))
    queue3.add(Num("d", -15))
    queue3.add(Num("e", -10))
    queue3.add(Num("g", 15))
    queue3.add(Num("f", 0))
    lst3 = []

    while not queue3.is_empty():
        value = queue3.remove()
        lst3.append(value.id)

    assert lst3 == ["d", "e", "c", "f", "a", "b",'g']








