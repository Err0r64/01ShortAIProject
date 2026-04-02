# Tetris Game

A classic Tetris game built with vanilla JavaScript, HTML5 Canvas, and CSS.

## 🎮 Features

- **Classic Tetris Gameplay**: All 7 standard Tetromino pieces (I, O, T, S, Z, J, L)
- **Score System**: Points based on lines cleared (100, 300, 500, 800 for 1-4 lines)
- **Progressive Difficulty**: Game speed increases as you clear more lines
- **Next Piece Preview**: See the upcoming piece to plan your moves
- **Wall Kick System**: Pieces attempt to adjust position when rotating near walls
- **Responsive Controls**: Support for both arrow keys and WASD
- **Modern UI**: Sleek dark theme with neon accents and smooth animations

## 🕹️ Controls

| Key | Action |
|-----|--------|
| ← / A | Move Left |
| → / D | Move Right |
| ↓ / S | Soft Drop (faster fall) |
| ↑ / W | Slow Down |
| Space | Rotate piece |

## 📁 Project Structure

```
01ShortAICode/
├── index.html    # Main HTML structure with game screens
├── style.css     # Styling and animations
├── game.js       # Game logic and rendering
└── README.md     # Documentation
```

## 🚀 How to Run

1. Clone or download the project files
2. Open `index.html` in a modern web browser
3. Click the **Play** button to start
4. Enjoy the game!

No build tools or dependencies required - just open and play!

## 🎯 Gameplay

1. **Objective**: Clear horizontal lines by filling them completely with blocks
2. **Scoring**: Clear multiple lines at once for bonus points
3. **Game Over**: The game ends when pieces stack up to the top of the board

### Scoring System

| Lines Cleared | Points |
|---------------|--------|
| 1 Line | 100 |
| 2 Lines | 300 |
| 3 Lines | 500 |
| 4 Lines (Tetris) | 800 |

## 🛠️ Technical Details

- **Grid Size**: 10 columns × 20 rows
- **Block Size**: 30px × 30px
- **Canvas Dimensions**: 300px × 600px
- **Technologies**: HTML5 Canvas, Vanilla JavaScript, CSS3

## 📸 Game Screens

- **Home Screen**: Title, play button, and controls reference
- **Countdown Screen**: 3-2-1-GO! countdown before game starts
- **Game Screen**: Main gameplay with score and next piece display
- **Game Over Screen**: Final score and restart option

## 🎨 Tetromino Colors

| Piece | Color |
|-------|-------|
| I | Cyan |
| O | Yellow |
| T | Purple |
| S | Green |
| Z | Red |
| J | Blue |
| L | Orange |

## License

This project is open source and available for educational purposes.
