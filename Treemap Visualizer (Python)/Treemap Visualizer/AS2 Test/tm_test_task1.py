from tm_trees import FileSystemTree, TMTree
import os
import pytest
path = os.getcwd()
link = os.path.join(path, "Test_folder")
link2 = os.path.join(path, "Test_file.txt")


def test_build_tree():
    tree = FileSystemTree(link)
    assert tree._name == "Test_folder"
    assert tree.data_size == 317
    assert len(tree._subtrees) == 2
    assert tree._parent_tree is None
    assert tree._expanded is False

    t1 = tree._subtrees[0]
    assert t1._name == "T1"
    assert t1.data_size == 15
    assert len(t1._subtrees) == 2
    assert t1._parent_tree is tree
    assert t1._expanded is False

    t2 = tree._subtrees[1]
    assert t2._name == "T2"
    assert t2.data_size == 302
    assert len(t2._subtrees) == 2
    assert t2._parent_tree is tree
    assert t2._expanded is False

    f1 = t1._subtrees[0]
    assert f1._name == "Empty"
    assert f1.data_size == 0
    assert len(f1._subtrees) == 0
    assert f1._parent_tree is t1
    assert f1._expanded is False

    f1 = t1._subtrees[1]
    assert f1._name == "file1.txt"
    assert f1.data_size == 15
    assert len(f1._subtrees) == 0
    assert f1._parent_tree is t1
    assert f1._expanded is False

    f2 = t2._subtrees[0]
    assert f2._name == "File8.txt"
    assert f2.data_size == 59
    assert len(f2._subtrees) == 0
    assert f2._parent_tree is t2
    assert f2._expanded is False

    f3 = t2._subtrees[1]
    assert f3._name == "File9.txt"
    assert f3.data_size == 243
    assert len(f3._subtrees) == 0
    assert f3._parent_tree is t2
    assert f3.get_parent() is t2
    assert f3._expanded is False

    tree2 = FileSystemTree(link2)
    assert tree2._name == "Test_file.txt"
    assert tree2._expanded is False
    assert len(tree2._subtrees) == 0
    assert tree2._parent_tree is None
    assert tree2.data_size == 0





