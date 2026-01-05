from tm_trees import TMTree, FileSystemTree
import os
path = os.getcwd()
link = os.path.join(path, "Test_examples", "Test_folder")

link2 = os.path.join(path, "Test_examples","example-directory", "workshop")


def test_out_off_bounds():
    tree = FileSystemTree(link2)
    tree.update_rectangles((0, 0, 200, 100))
    val0 = tree.get_tree_at_position((201, 90))
    assert val0 is None

    val1 = tree.get_tree_at_position((-1, 90))
    assert val1 is None

    val2 = tree.get_tree_at_position((50, 110))
    assert val2 is None

    val3 = tree.get_tree_at_position((50, -2))
    assert val3 is None

    val4 = tree.get_tree_at_position((-1, -2))
    assert val4 is None

    val = tree.get_tree_at_position((0, 99))
    assert val._name == "Plan.tex"

    t1 = tree._subtrees[0]._subtrees[0]
    assert t1._name == "images"
    assert t1.rect == (0, 0, 94, 97)

    val0 = t1.get_tree_at_position((0, 98))
    assert val0 is None

    val0 = t1.get_tree_at_position((0, 97))
    assert val0 is t1._subtrees[1]

    val1 = tree.get_tree_at_position((0, 98))
    assert val1 is tree._subtrees[0]._subtrees[1]

    val2 = t1.get_tree_at_position((0, 28))
    assert val2._name == "Q2.pdf"

    val3 = t1.get_tree_at_position((0, 0))
    assert val3._name == "Q2.pdf"

    leaf1 = tree._subtrees[0]._subtrees[0]._subtrees[0]
    leaf2 = tree._subtrees[0]._subtrees[0]._subtrees[1]
    leaf3 = tree._subtrees[0]._subtrees[1]
    leaf4 = tree._subtrees[1]
    leaf5 = tree._subtrees[2]._subtrees[0]._subtrees[0]
    leaf6 = tree._subtrees[2]._subtrees[1]

    for x in range(0, 95):
        for y in range(0, 29):
            val = tree.get_tree_at_position((x, y))
            assert val is leaf1

    for x in range(0, 95):
        for y in range(29, 98):
            val = tree.get_tree_at_position((x, y))
            assert val is leaf2

    for x in range(0, 95):
        for y in range(98, 101):
            val = tree.get_tree_at_position((x, y))
            assert val is leaf3

    for x in range(95, 171):
        for y in range(0, 101):
            val = tree.get_tree_at_position((x, y))
            assert val is leaf4

    for x in range(171, 201):
        for y in range(0, 73):
            val = tree.get_tree_at_position((x, y))
            assert val is leaf5

    for x in range(171, 201):
        for y in range(73, 101):
            val = tree.get_tree_at_position((x, y))
            assert val is leaf6

    assert tree.get_tree_at_position((200,100)) is leaf6

    assert leaf6._name == "reading.md"
