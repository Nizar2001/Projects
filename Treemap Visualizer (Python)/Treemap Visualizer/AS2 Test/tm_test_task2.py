from tm_trees import TMTree, FileSystemTree
import os

path = os.getcwd()
link = os.path.join(path, "Test_examples", "Test_folder")

link2 = os.path.join(path, "Test_examples","example-directory", "workshop")
link3 = os.path.join(path, "Test_examples","new")
link4 = os.path.join(path, "Test_examples", "A")
link5 = os.path.join(path, "Test_examples", "empty_files")


def test_rectangle():
    rectangle = (0, 0, 200, 100)
    tree = FileSystemTree(link)
    tree.update_rectangles(rectangle)

    assert tree._name == "Test_folder"
    assert tree.rect == (0, 0, 200, 100)
    assert tree.data_size == 317

    t1 = tree._subtrees[0]
    assert t1._name == "T1"
    assert t1.data_size == 15
    assert t1.rect == (0, 0, 9, 100)

    f1 = t1._subtrees[1]
    assert f1._name == "file1.txt"
    assert t1.data_size == f1.data_size
    assert t1.rect == f1.rect

    t2 = tree._subtrees[1]
    assert t2._name == "T2"
    assert t2.data_size == 302
    assert t2.rect == (9, 0, 191, 100)

    f2 = t2._subtrees[0]
    assert f2._name == "File8.txt"
    assert f2.data_size == 59
    assert f2.rect == (9, 0, 37, 100)

    f3 = t2._subtrees[1]
    assert f3._name == "File9.txt"
    assert f3.data_size == 243
    assert f3.rect == (46, 0, 154, 100)


def test_rect():
    tree = FileSystemTree(link2)
    assert tree._name == "workshop"
    assert tree._parent_tree is None
    assert tree.data_size == 151
    assert len(tree._subtrees) == 3
    assert tree.rect == (0, 0, 0, 0)

    t1 = tree._subtrees[0]
    t2 = tree._subtrees[2]
    t3 = tree._subtrees[1]

    assert t1._name == "activities"
    assert t1.data_size == 71
    assert t1._parent_tree is tree
    assert t1._expanded is False
    assert len(t1._subtrees) == 2
    assert t1.rect == (0, 0, 0, 0)

    s1 = t1._subtrees[0]
    s2 = t1._subtrees[1]

    assert s1._name == "images"
    assert s1.data_size == 69
    assert len(s1._subtrees) == 2
    assert s1._parent_tree is t1
    assert s1.rect == (0, 0, 0, 0)

    u1 = s1._subtrees[0]
    u2 = s1._subtrees[1]

    assert u1._name == "Q2.pdf"
    assert u1.data_size == 20
    assert u1._subtrees == []
    assert u1._parent_tree is s1
    assert u1.rect == (0, 0, 0, 0)

    assert u2._name == "Q3.pdf"
    assert u2.data_size == 49
    assert u2._parent_tree is s1
    assert u2._subtrees == []
    assert u2.rect == (0, 0, 0, 0)

    assert s2._name == "Plan.tex"
    assert s2.data_size == 2
    assert len(s2._subtrees) == 0
    assert s2._parent_tree is t1
    assert s2.rect == (0, 0, 0, 0)

    assert t2._name == "prep"
    assert t2.data_size == 22
    assert t2._expanded is False
    assert t2._parent_tree is tree
    assert len(t2._subtrees) == 2
    assert t2.rect == (0, 0, 0, 0)

    x1 = t2._subtrees[0]
    x2 = t2._subtrees[1]

    assert x1._name == "images"
    assert x1.data_size == 16
    assert x1._parent_tree is t2
    assert len(x1._subtrees) == 1
    assert x1._expanded is False
    assert x1.rect == (0, 0, 0, 0)

    y1 = x1._subtrees[0]
    assert y1._name == "Cats.pdf"
    assert y1.data_size == 16
    assert len(y1._subtrees) == 0
    assert y1._parent_tree is x1
    assert y1._expanded is False
    assert y1.rect == (0, 0, 0, 0)

    assert x2._name == "reading.md"
    assert x2.data_size == 6
    assert len(x2._subtrees) == 0
    assert x2._parent_tree is t2
    assert x2._expanded is False
    assert x2.rect == (0, 0, 0, 0)

    assert t3._name == "draft.pptx"
    assert t3.data_size == 58
    assert t3._parent_tree is tree
    assert len(t3._subtrees) == 0
    assert t3.rect == (0, 0, 0, 0)

    tree.update_rectangles((0, 0, 200, 100))
    assert tree.rect == (0, 0, 200, 100)
    assert t1.rect == (0, 0, 94, 100)
    assert t2.rect == (170, 0, 30, 100)
    assert t3.rect == (94, 0, 76, 100)
    assert s1.rect == (0, 0, 94, 97)
    assert s2.rect == (0, 97, 94, 3)
    assert x1.rect == (170, 0, 30, 72)
    assert x2.rect == (170, 72, 30, 28)
    assert y1.rect == (170, 0, 30, 72)


def test_files():
    tree = FileSystemTree(link3)
    assert tree._name == "new"
    assert len(tree._subtrees) == 20

    for subtrees in tree._subtrees:
        assert subtrees.data_size == 1

    for subtrees in tree._subtrees:
        assert subtrees._parent_tree is tree

    for subtrees in tree._subtrees:
        assert subtrees.rect == (0, 0, 0, 0)

    tree.update_rectangles((0, 0, 200, 100))

    x = 0
    for subtrees in tree._subtrees:
        assert subtrees.rect == (x, 0, 10, 100)
        x += 10


def test_general():
    A = FileSystemTree(link4)
    assert A._name == "A"
    assert len(A._subtrees) == 2
    assert A._subtrees[0]._name == "B"

    assert A._subtrees[0]._subtrees[0]._name == "Z"
    assert A._subtrees[0]._subtrees[0]._subtrees[0]._name == "P.txt"

    assert A._subtrees[1]._subtrees[0]._name == "E.txt"
    assert A._subtrees[1]._subtrees[1]._name == "F.txt"
    assert A._subtrees[1]._subtrees[2]._name == "G.txt"

    b = A._subtrees[0]
    c = A._subtrees[1]
    z = b._subtrees[0]
    p = z._subtrees[0]
    x = z._subtrees[1]

    e = c._subtrees[0]
    f = c._subtrees[1]
    g = c._subtrees[2]
    h = c._subtrees[3]

    A.update_rectangles((0, 0, 80, 60))
    assert A.rect == (0, 0, 80, 60)
    assert b.rect == (0, 0, 35, 60)
    assert z.rect == b.rect
    assert z.rect == b.rect == p.rect
    assert x.rect == (0, 0, 0, 0)
    assert c.rect == (35, 0, 45, 60)
    assert e.rect == (35, 0, 45, 11)
    assert f.rect == (35, 11, 45, 20)
    assert g.rect == (35, 31, 45, 29)
    assert h.rect == (0, 0, 0, 0)


def test_empty():
    tree = FileSystemTree(link5)
    assert tree._subtrees[2]._name == "f3.txt"
    assert tree._subtrees[3]._name == "f4.txt"
    tree.update_rectangles((0, 0, 200, 100))

    assert tree._subtrees[0].rect == (0, 0, 0, 0)
    assert tree._subtrees[1].rect == (0, 0, 0, 0)
    assert tree._subtrees[2].rect == (0, 0, 85, 100)
    assert tree._subtrees[3].rect == (85, 0, 115, 100)
    assert tree._subtrees[4].rect == (0, 0, 0, 0)
    assert tree._subtrees[5].rect == (0, 0, 0, 0)


def test_get_rect():
    tree = FileSystemTree(link2)
    tree.update_rectangles((0, 0, 200, 100))
    rectangles = tree.get_rectangles()

    t1 = tree._subtrees[0]
    t2 = tree._subtrees[2]
    t3 = tree._subtrees[1]

    s1 = t1._subtrees[0]
    s2 = t1._subtrees[1]
    u1 = s1._subtrees[0]
    u2 = s1._subtrees[1]
    x1 = t2._subtrees[0]
    x2 = t2._subtrees[1]
    y1 = x1._subtrees[0]

    assert tree.rect == (0, 0, 200, 100)
    assert t1.rect == (0, 0, 94, 100)
    assert t2.rect == (170, 0, 30, 100)
    assert t3.rect == (94, 0, 76, 100)
    assert s1.rect == (0, 0, 94, 97)
    assert s2.rect == (0, 97, 94, 3)
    assert x1.rect == (170, 0, 30, 72)
    assert x2.rect == (170, 72, 30, 28)
    assert y1.rect == (170, 0, 30, 72)

    rec = [(0, 0, 94, 28), (0, 28, 94, 69), (0, 97, 94, 3), (94, 0, 76, 100),
           (170, 0, 30, 72), (170, 72, 30, 28)]

    for elements in rectangles:
        assert elements[0] in rec

    for r in range(len(rectangles)):
        assert rectangles[r][0] == rec[r]

    A = FileSystemTree(link4)
    b = A._subtrees[0]
    c = A._subtrees[1]
    z = b._subtrees[0]
    p = z._subtrees[0]
    x = z._subtrees[1]
    e = c._subtrees[0]
    f = c._subtrees[1]
    g = c._subtrees[2]
    h = c._subtrees[3]

    A.update_rectangles((0, 0, 80, 60))
    rectangles = A.get_rectangles()
    rec = [(0, 0, 35, 60), (0, 0, 0, 0), (35, 0, 45, 11), (35, 11, 45, 20),
           (35, 31, 45, 29), (0, 0, 0, 0)]
    assert len(rectangles) == len(rec)
    assert rectangles[0][0] == (0, 0, 35, 60)
    for r in rectangles:
        assert r[0] in rec

    for r in range(len(rectangles)):
        assert rectangles[r][0] == rec[r]
