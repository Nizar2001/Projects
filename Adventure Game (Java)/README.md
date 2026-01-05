# JavaFX Adventure Game

Welcome to the **JavaFX Adventure Game**, a command-driven adventure game built in **Java** using **JavaFX**. Explore different maps, collect useful items, avoid traps, and survive by making smart decisions.

---

##  What You Need to Get Started

To run this game, make sure you have the following installed on your computer:

### Required Software

1. **Java Development Kit (JDK)** – Version 11 or later  
   🔗 [Download JDK](https://www.oracle.com/java/technologies/javase-downloads.html)

2. **JavaFX SDK** – Required for the graphical interface  
   🔗 [Download JavaFX SDK](https://gluonhq.com/products/javafx/)

3. **An IDE that supports JavaFX**, such as:
   - [IntelliJ IDEA](https://www.jetbrains.com/idea/) (recommended)
   - Eclipse with JavaFX plugin

---

##  How to Set It Up and Run

You’ll be using an IDE (like IntelliJ) to open and run the game project. No need to use the terminal or command line.

### Step 1: Set Up JavaFX in IntelliJ

1. Install JavaFX SDK and extract the folder.
2. Open IntelliJ and import or open the project folder.
3. Go to `File` → `Project Structure` → `Libraries`  
   → Click `+` and add the `lib` folder from your JavaFX SDK.
4. Then go to `Run` → `Edit Configurations`
   - Add the following to **VM options**:

     ```
     --module-path /path/to/javafx-sdk/lib --add-modules javafx.controls,javafx.fxml
     ```

     Replace `/path/to/javafx-sdk` with the actual location of your JavaFX SDK folder.

5. Click **Apply** and **OK** to save your configuration.


### Step 2: Run the Game

1. In IntelliJ (or your chosen IDE), find and open the file:

   `AdventureGameApp.java`

2. Right-click on it and select **Run 'AdventureGameApp'**.

   If JavaFX is set up correctly, the game window will appear.

---

##  How to Play

- **Choose a map**: Either `TinyGame` for a simpler experience or `HardGame` for a challenge.
- **Select a character**: Characters have different starting health levels.
- Control your character by typing commands into the text area:
  - Movement: `north`, `south`, `east`, `west` or simply `n`, `s`, `e`, `w`
  - Get help: Type `help` (or click on the instruction button) to see game instructions and how to play
  - Check inventory: Type `i`or `inventory` to display the items in your inventory
  - Get your current location: Type `look` or `l` to describe your current location
  - Show allowed moves: Type `commands` or `c` to see the allowed moves from your current location
  - Pick up items: `take item_name` (or click on the item)
  - Drop items: `drop item_name` (or click on the item in your inventory) 
  - Save and load progress: click on the save or load buttons
  - Exit game: Type `quit` or `q` and press **Enter** to quit the game
---

## Tips and Objectives

- Collect useful items like food to restore health.
- Avoid dangerous items (e.g. poison or snake) or falling into pits — they reduce your health and may end the game.
- Winning requires good decisions, careful movement, and staying alive.
- If your health hits 0, or you fall into a pit, the game ends, and you need to restart or quit.

---

##  Project Structure

- `AdventureGameApp.java` – main entry point
- `AdventureModel` – core game logic (rooms, items, player, etc.)
- `views` – JavaFX views and UI handling
- Serializable game state: supports saving/loading

---

## Trouble Launching the Game?

- Ensure JavaFX is correctly added to your project libraries.
- Make sure VM options are properly set with `--module-path`.
- You're running `AdventureGameUp.java`, not a helper file.

---

Enjoy your journey through the world of adventure!