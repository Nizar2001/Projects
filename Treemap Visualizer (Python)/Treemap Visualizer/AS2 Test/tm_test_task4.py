from tm_trees import TMTree, FileSystemTree
import os
import pytest
path = os.getcwd()
link2 = os.path.join(path, "Test_examples","example-directory", "workshop")


def test_update_size():
    tree = FileSystemTree(link2)
    activities = tree._subtrees[0]
    prep = tree._subtrees[2]
    leaf1 = tree._subtrees[0]._subtrees[0]._subtrees[0]
    leaf2 = tree._subtrees[0]._subtrees[0]._subtrees[1]
    leaf3 = tree._subtrees[0]._subtrees[1]
    leaf4 = tree._subtrees[1]
    leaf5 = tree._subtrees[2]._subtrees[0]._subtrees[0]
    leaf6 = tree._subtrees[2]._subtrees[1]

    assert activities.data_size == 71
    assert leaf6.data_size == 6
    assert prep.data_size == 22

    leaf6.change_size(-0.01)
    assert leaf6.data_size == 5
    leaf6.change_size(-0.01)
    leaf6.change_size(-0.01)
    leaf6.change_size(-0.01)
    leaf6.change_size(-0.01)
    assert leaf6.data_size == 1
    for i in range(0, 1000000):
        leaf6.change_size(-0.00000011)
    assert leaf6.data_size == 1

    leaf1.change_size(-0.3)

    assert tree.update_data_sizes()
    assert activities.data_size == 65
    assert prep.data_size == 17
    assert tree.data_size == 140


def test_delete():
    tree = FileSystemTree(link2)
    activities = tree._subtrees[0]
    prep = tree._subtrees[2]
    leaf1 = tree._subtrees[0]._subtrees[0]._subtrees[0]
    leaf2 = tree._subtrees[0]._subtrees[0]._subtrees[1]
    leaf3 = tree._subtrees[0]._subtrees[1]
    leaf4 = tree._subtrees[1]
    leaf5 = tree._subtrees[2]._subtrees[0]._subtrees[0]
    leaf6 = tree._subtrees[2]._subtrees[1]
    assert len(tree._subtrees) == 3
    assert leaf4.delete_self()
    assert len(tree._subtrees) == 2
    assert activities._subtrees[1].delete_self()
    assert len(activities._subtrees) == 1
    tree.update_data_sizes()
    assert activities.data_size == 69
    assert tree.data_size == 91
    assert activities._subtrees[0].delete_self()
    assert len(tree._subtrees) == 1
    assert tree.update_data_sizes()
    assert tree.data_size == prep.data_size
    assert tree._subtrees[0] is prep
    tree.delete_self()
    assert tree.data_size == prep.data_size
    assert tree._subtrees[0] is prep
    assert tree._name == "workshop"

    l = len(tree._subtrees)
    print(l)
    assert tree._subtrees[0] is prep
    assert prep._parent_tree is tree
    assert prep.delete_self()

    assert not tree.delete_self()

    tree = FileSystemTree(link2)
    activities = tree._subtrees[0]
    prep = tree._subtrees[2]
    leaf1 = tree._subtrees[0]._subtrees[0]._subtrees[0]
    leaf2 = tree._subtrees[0]._subtrees[0]._subtrees[1]
    leaf3 = tree._subtrees[0]._subtrees[1]
    leaf4 = tree._subtrees[1]
    leaf5 = tree._subtrees[2]._subtrees[0]._subtrees[0]
    leaf6 = tree._subtrees[2]._subtrees[1]
    l = len(activities._subtrees)
    for elements in range(l):
        assert activities._subtrees[0].delete_self()
    assert len(tree._subtrees) == 2

    assert prep.delete_self()



