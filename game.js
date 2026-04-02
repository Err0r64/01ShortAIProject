// Tetris Game

// Game constants
const COLS = 10;
const ROWS = 20;
const BLOCK_SIZE = 30;
const COLORS = {
    I: '#00ffff', // Cyan
    O: '#ffff00', // Yellow
    T: '#800080', // Purple
    S: '#00ff00', // Green
    Z: '#ff0000', // Red
    J: '#0000ff', // Blue
    L: '#ff7f00'  // Orange
};

// Tetromino shapes (all 7 standard pieces from the image)
const SHAPES = {
    I: [
        [0, 0, 0, 0],
        [1, 1, 1, 1],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ],
    O: [
        [1, 1],
        [1, 1]
    ],
    T: [
        [0, 1, 0],
        [1, 1, 1],
        [0, 0, 0]
    ],
    S: [
        [0, 1, 1],
        [1, 1, 0],
        [0, 0, 0]
    ],
    Z: [
        [1, 1, 0],
        [0, 1, 1],
        [0, 0, 0]
    ],
    J: [
        [1, 0, 0],
        [1, 1, 1],
        [0, 0, 0]
    ],
    L: [
        [0, 0, 1],
        [1, 1, 1],
        [0, 0, 0]
    ]
};

// Game state
let canvas, ctx, nextCanvas, nextCtx;
let board = [];
let currentPiece = null;
let nextPiece = null;
let score = 0;
let gameLoop = null;
let dropInterval = 1000; // Normal drop speed (ms)
let currentDropInterval = dropInterval;
let lastDropTime = 0;
let isGameOver = false;
let isSlowMode = false;

// DOM Elements
const homeScreen = document.getElementById('home-screen');
const countdownScreen = document.getElementById('countdown-screen');
const gameScreen = document.getElementById('game-screen');
const gameOverScreen = document.getElementById('game-over-screen');
const playBtn = document.getElementById('play-btn');
const restartBtn = document.getElementById('restart-btn');
const countdownNumber = document.getElementById('countdown-number');
const scoreDisplay = document.getElementById('score');
const finalScoreDisplay = document.getElementById('final-score');

// Initialize game
function init() {
    canvas = document.getElementById('game-canvas');
    ctx = canvas.getContext('2d');
    nextCanvas = document.getElementById('next-canvas');
    nextCtx = nextCanvas.getContext('2d');
    
    playBtn.addEventListener('click', startCountdown);
    restartBtn.addEventListener('click', startCountdown);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
}

// Start countdown
function startCountdown() {
    homeScreen.classList.add('hidden');
    gameOverScreen.classList.add('hidden');
    countdownScreen.classList.remove('hidden');
    
    let count = 3;
    countdownNumber.textContent = count;
    
    const countdownInterval = setInterval(() => {
        count--;
        if (count > 0) {
            countdownNumber.textContent = count;
        } else if (count === 0) {
            countdownNumber.textContent = 'GO!';
        } else {
            clearInterval(countdownInterval);
            countdownScreen.classList.add('hidden');
            gameScreen.classList.remove('hidden');
            startGame();
        }
    }, 1000);
}

// Start the game
function startGame() {
    // Reset game state
    board = createBoard();
    score = 0;
    scoreDisplay.textContent = score;
    isGameOver = false;
    dropInterval = 1000;
    currentDropInterval = dropInterval;
    
    // Generate pieces
    nextPiece = generatePiece();
    spawnPiece();
    
    // Start game loop
    lastDropTime = performance.now();
    gameLoop = requestAnimationFrame(update);
}

// Create empty board
function createBoard() {
    return Array.from({ length: ROWS }, () => Array(COLS).fill(0));
}

// Generate random piece
function generatePiece() {
    const pieces = Object.keys(SHAPES);
    const type = pieces[Math.floor(Math.random() * pieces.length)];
    return {
        type: type,
        shape: SHAPES[type].map(row => [...row]),
        color: COLORS[type],
        x: Math.floor(COLS / 2) - Math.floor(SHAPES[type][0].length / 2),
        y: 0
    };
}

// Spawn new piece
function spawnPiece() {
    currentPiece = nextPiece;
    nextPiece = generatePiece();
    drawNextPiece();
    
    // Check if game over
    if (!isValidMove(currentPiece, 0, 0)) {
        gameOver();
    }
}

// Main game loop
function update(time) {
    if (isGameOver) return;
    
    const deltaTime = time - lastDropTime;
    
    if (deltaTime > currentDropInterval) {
        moveDown();
        lastDropTime = time;
    }
    
    draw();
    gameLoop = requestAnimationFrame(update);
}

// Draw everything
function draw() {
    // Clear canvas
    ctx.fillStyle = '#0f0f1a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw board
    for (let y = 0; y < ROWS; y++) {
        for (let x = 0; x < COLS; x++) {
            if (board[y][x]) {
                drawBlock(ctx, x, y, board[y][x]);
            }
        }
    }
    
    // Draw current piece
    if (currentPiece) {
        for (let y = 0; y < currentPiece.shape.length; y++) {
            for (let x = 0; x < currentPiece.shape[y].length; x++) {
                if (currentPiece.shape[y][x]) {
                    drawBlock(ctx, currentPiece.x + x, currentPiece.y + y, currentPiece.color);
                }
            }
        }
    }
    
    // Draw grid lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 1;
    for (let x = 0; x <= COLS; x++) {
        ctx.beginPath();
        ctx.moveTo(x * BLOCK_SIZE, 0);
        ctx.lineTo(x * BLOCK_SIZE, canvas.height);
        ctx.stroke();
    }
    for (let y = 0; y <= ROWS; y++) {
        ctx.beginPath();
        ctx.moveTo(0, y * BLOCK_SIZE);
        ctx.lineTo(canvas.width, y * BLOCK_SIZE);
        ctx.stroke();
    }
}

// Draw a single block
function drawBlock(context, x, y, color) {
    const padding = 1;
    context.fillStyle = color;
    context.fillRect(
        x * BLOCK_SIZE + padding,
        y * BLOCK_SIZE + padding,
        BLOCK_SIZE - padding * 2,
        BLOCK_SIZE - padding * 2
    );
    
    // Add highlight
    context.fillStyle = 'rgba(255, 255, 255, 0.3)';
    context.fillRect(
        x * BLOCK_SIZE + padding,
        y * BLOCK_SIZE + padding,
        BLOCK_SIZE - padding * 2,
        5
    );
}

// Draw next piece preview
function drawNextPiece() {
    nextCtx.fillStyle = '#0f0f1a';
    nextCtx.fillRect(0, 0, nextCanvas.width, nextCanvas.height);
    
    if (!nextPiece) return;
    
    const blockSize = 20;
    const offsetX = (nextCanvas.width - nextPiece.shape[0].length * blockSize) / 2;
    const offsetY = (nextCanvas.height - nextPiece.shape.length * blockSize) / 2;
    
    for (let y = 0; y < nextPiece.shape.length; y++) {
        for (let x = 0; x < nextPiece.shape[y].length; x++) {
            if (nextPiece.shape[y][x]) {
                nextCtx.fillStyle = nextPiece.color;
                nextCtx.fillRect(
                    offsetX + x * blockSize + 1,
                    offsetY + y * blockSize + 1,
                    blockSize - 2,
                    blockSize - 2
                );
            }
        }
    }
}

// Check if move is valid
function isValidMove(piece, offsetX, offsetY, newShape = null) {
    const shape = newShape || piece.shape;
    for (let y = 0; y < shape.length; y++) {
        for (let x = 0; x < shape[y].length; x++) {
            if (shape[y][x]) {
                const newX = piece.x + x + offsetX;
                const newY = piece.y + y + offsetY;
                
                if (newX < 0 || newX >= COLS || newY >= ROWS) {
                    return false;
                }
                
                if (newY >= 0 && board[newY][newX]) {
                    return false;
                }
            }
        }
    }
    return true;
}

// Move piece down
function moveDown() {
    if (isValidMove(currentPiece, 0, 1)) {
        currentPiece.y++;
    } else {
        lockPiece();
        clearLines();
        spawnPiece();
    }
}

// Move piece left
function moveLeft() {
    if (isValidMove(currentPiece, -1, 0)) {
        currentPiece.x--;
    }
}

// Move piece right
function moveRight() {
    if (isValidMove(currentPiece, 1, 0)) {
        currentPiece.x++;
    }
}

// Rotate piece clockwise
function rotate() {
    const newShape = rotateMatrix(currentPiece.shape);
    if (isValidMove(currentPiece, 0, 0, newShape)) {
        currentPiece.shape = newShape;
    } else {
        // Wall kick - try moving left or right
        if (isValidMove(currentPiece, -1, 0, newShape)) {
            currentPiece.x--;
            currentPiece.shape = newShape;
        } else if (isValidMove(currentPiece, 1, 0, newShape)) {
            currentPiece.x++;
            currentPiece.shape = newShape;
        } else if (isValidMove(currentPiece, -2, 0, newShape)) {
            currentPiece.x -= 2;
            currentPiece.shape = newShape;
        } else if (isValidMove(currentPiece, 2, 0, newShape)) {
            currentPiece.x += 2;
            currentPiece.shape = newShape;
        }
    }
}

// Rotate matrix 90 degrees clockwise
function rotateMatrix(matrix) {
    const N = matrix.length;
    const result = matrix.map((row, i) =>
        row.map((_, j) => matrix[N - 1 - j][i])
    );
    return result;
}

// Lock piece to board
function lockPiece() {
    for (let y = 0; y < currentPiece.shape.length; y++) {
        for (let x = 0; x < currentPiece.shape[y].length; x++) {
            if (currentPiece.shape[y][x]) {
                const boardY = currentPiece.y + y;
                const boardX = currentPiece.x + x;
                if (boardY >= 0) {
                    board[boardY][boardX] = currentPiece.color;
                }
            }
        }
    }
}

// Clear completed lines
function clearLines() {
    let linesCleared = 0;
    
    for (let y = ROWS - 1; y >= 0; y--) {
        if (board[y].every(cell => cell !== 0)) {
            board.splice(y, 1);
            board.unshift(Array(COLS).fill(0));
            linesCleared++;
            y++; // Check the same row again
        }
    }
    
    if (linesCleared > 0) {
        // Score based on lines cleared
        const points = [0, 100, 300, 500, 800];
        score += points[linesCleared] || linesCleared * 200;
        scoreDisplay.textContent = score;
        
        // Increase speed slightly
        dropInterval = Math.max(100, dropInterval - linesCleared * 20);
        if (!isSlowMode) {
            currentDropInterval = dropInterval;
        }
    }
}

// Handle key down
function handleKeyDown(e) {
    if (isGameOver || gameScreen.classList.contains('hidden')) return;
    
    switch (e.key) {
        case 'ArrowLeft':
        case 'a':
        case 'A':
            e.preventDefault();
            moveLeft();
            break;
        case 'ArrowRight':
        case 'd':
        case 'D':
            e.preventDefault();
            moveRight();
            break;
        case 'ArrowDown':
        case 's':
        case 'S':
            e.preventDefault();
            currentDropInterval = 50; // Fast drop
            break;
        case 'ArrowUp':
        case 'w':
        case 'W':
            e.preventDefault();
            isSlowMode = true;
            currentDropInterval = dropInterval * 2; // Slow down
            break;
        case ' ':
            e.preventDefault();
            rotate();
            break;
    }
}

// Handle key up
function handleKeyUp(e) {
    if (isGameOver || gameScreen.classList.contains('hidden')) return;
    
    switch (e.key) {
        case 'ArrowDown':
        case 's':
        case 'S':
        case 'ArrowUp':
        case 'w':
        case 'W':
            isSlowMode = false;
            currentDropInterval = dropInterval;
            break;
    }
}

// Game over
function gameOver() {
    isGameOver = true;
    cancelAnimationFrame(gameLoop);
    
    finalScoreDisplay.textContent = score;
    gameScreen.classList.add('hidden');
    gameOverScreen.classList.remove('hidden');
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', init);
