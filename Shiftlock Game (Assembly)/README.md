# ShiftLock - RISC-V Sokoban Game  
*A puzzle game for CPUlator with multiplayer support*  
 


## How to Start
1. Open [CPUlator RISC-V RV32 System Simulator](https://cpulator.01xz.net/?sys=riscv)
2. Load the game file:
   - Click the blue "File" icon → "Open"
   - Select the "ShiftLock.s" game file
3. Launch the game:
   - Click "Compile and Load"
   - Click "Continue"
4. Play via terminal input (right panel)

---

## Key Features  
- **Multiplayer Mode**: Compete on the same puzzle (lowest moves wins)
- **Dynamic Grids**: Custom sizes (6–255 rows/columns)  
- **Leaderboard**: Ranks players by move efficiency  

---

## Game Elements  
| Symbol | Meaning       |  
|--------|---------------|  
| `@`    | Player        |  
| `%`    | Box           |  
| `X`    | Target        |  
| `#`    | Wall          |  

## Controls
| Input | Action       |
|-------|--------------|
| 1     | Move Up      |
| 2     | Move Down    |
| 3     | Move Left    |
| 4     | Move Right   |
| 5     | Restart Game |
| 9     | Exit Game    |

## Cheat Codes
- `1234`: Teleport to target
- `2024`: Instant win

## Pro Tips  
✔ **Avoid dead ends**: Boxes can’t be pulled!  
✔ **Watch moves**: Every input counts, even failed attempts.  
✔ **CPUlator Limits**: Columns >100 may distort walls.  

---

## Technical Notes
- **Randomization**: LCG algorithm (seed = time)  
- **Memory**: Stack-managed board states  

---

## FAQ  
**Q: Why can’t I see walls properly?**  
A: CPUlator has console width limits. Use ≤100 columns.  

**Q: How does multiplayer work?**  
A: Players take turns on the same board. Leaderboard ranks move counts.  

**Need Help?** Refer to the [full user guide](User%20Guide.pdf).  