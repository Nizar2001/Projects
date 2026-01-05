
# Treemap Visualization

## Overview

This project is an interactive **Treemap Visualization Tool** built with Python. It was created for the CSC148 course at
the University of Toronto. The tool lets you explore the structure of a folder on your computer by turning it into a 
colorful, interactive treemap. Each rectangle represents a file or folder, sized according to how much space it 
takes up. The visualization is powered by **Pygame**, and the whole project is designed using object-oriented
programming principles.

---

## Features

-  This tool lets you explore a folder on your computer by turning it into a treemap—a visual layout where each item is a rectangle.
-  The size of each rectangle reflects how much space that file or folder uses on your computer.
-  Files are shown in bright, random colors. Folders are shaded in greyscale, getting lighter the deeper they are in the folder structure.
-  You can click on any rectangle to select it, then use your keyboard to perform actions like opening folders, resizing files, or deleting them.
-  The folder structure is built using recursion, so the program can handle complex, nested directories and update them on the fly.

---

## File Structure

```
project-folder/
├── tm_trees.py             # Contains TMTree and FileSystemTree classes
├── treemap_visualizer.py   # Launches the Pygame visualization
├── example-directory/      # Sample directory with test files
├── treemap_sample_test.py  # Unit tests to validate basic implementation
├── AS2 Test/               # Directory containing a comprehensive set of test cases
└── README.md               # Project overview and instructions
```

---

## Setup Instructions

1. Ensure you have **Python 3.8 or newer** installed.

2. Install required dependencies:

```bash
pip install pygame
```

3. Clone or download the project from this repository to your local machine.

4. (Optional) Modify the visualized path:

Open `treemap_visualizer.py` and find the `PATH_TO_VISUALIZE` constant. Set it to the path of the directory you want to visualize.

---

## How to Run

To start the visualization, run the `treemap_visualizer.py` file

---

## Controls

| Action | Key / Mouse | Description                                   |
|--------|-------------|-----------------------------------------------|
| Select Node | Left Click | Select or unselect a file/folder              |
| Expand | `E` | Expand selected folder                        |
| Expand All | `A` | Expand all folders inside the selected folder |
| Collapse | `C` | Collapse the selected folder's parent         |
| Collapse All | `X` | Collapse entire tree to root                  |
| Resize | `↑` / `↓` | Increase/decrease file size by 1%             |
| Delete | Delete Key | Remove selected file or folder                |
| Move | `M` | Move selected file to hovered folder          |
| Duplicate | `D` | Duplicate selected file                       |
| Copy & Paste | `V` | Copy selected file to hovered folder          |
| Visualize Folder | `Q` | Visualize only the selected folder            |

---

## Notes

- The tool **does not modify** your actual files or directories.
- Changes are made only in the visualization.
- Folder structures are loaded recursively using Python’s `os` module.

---

## Example

You can find an example directory included with sample files and folders. Once your code is working, running `treemap_visualizer.py` should display a colorful treemap of this structure.

---

## Author

Created as part of **CSC148: Introduction to Computer Science** at the **University of Toronto**.

---

## License

This project is provided for educational use and should not be used in production environments.
