document.addEventListener('DOMContentLoaded', () => {
    const gameBoardContainer = document.querySelector('.game-board');
    const statusText = document.getElementById('status');
    const resetButton = document.getElementById('resetButton');
    const gameModeSelect = document.getElementById('gameMode');
    const boardSizeLinks = document.querySelectorAll('.board-size-links a');

    let boardSize = 3;
    let board = [];
    let currentPlayer = 'X';
    let isGameActive = true;
    let gameMode = 'twoPlayer';

    // Initialize the game board
    const createBoard = () => {
        gameBoardContainer.innerHTML = '';
        board = Array(boardSize * boardSize).fill(null);
        gameBoardContainer.style.gridTemplateColumns = `repeat(${boardSize}, 1fr)`;
        gameBoardContainer.style.gridTemplateRows = `repeat(${boardSize}, 1fr)`;

        for (let i = 0; i < board.length; i++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.setAttribute('data-index', i);
            cell.addEventListener('click', handleCellClick);
            gameBoardContainer.appendChild(cell);
        }

        resetGame();
    };

    // Update the game status text
    const updateStatus = () => {
        if (!isGameActive) return; // Keep the win/draw message if the game is over
        statusText.textContent = `Turn: Player ${currentPlayer}`;
    };

    // Handle cell click events
    const handleCellClick = (e) => {
        const cell = e.target;
        const cellIndex = parseInt(cell.getAttribute('data-index'), 10);

        if (board[cellIndex] !== null || !isGameActive) return;

        makeMove(cellIndex);

        // If playing against the computer, let the computer take its turn
        if (isGameActive && gameMode === 'computer' && currentPlayer === 'O') {
            setTimeout(computerMove, 500);
        }
    };

    // Make a move for the current player
    const makeMove = (cellIndex) => {
        board[cellIndex] = currentPlayer;
        document.querySelector(`.cell[data-index="${cellIndex}"]`).textContent = currentPlayer;
        checkWinner();

        if (isGameActive) {
            switchPlayer();
            updateStatus();
        }
    };

    // Check if there is a winner or if the game is a draw
    const checkWinner = () => {
        const winPatterns = generateWinPatterns();

        for (let pattern of winPatterns) {
            if (pattern.every(index => board[index] === currentPlayer)) {
                isGameActive = false;
                statusText.textContent = `Player ${currentPlayer} wins!`;
                return;
            }
        }

        if (!board.includes(null)) {
            isGameActive = false;
            statusText.textContent = "It's a draw!";
        }
    };

    // Switch to the other player's turn
    const switchPlayer = () => {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    };

    // Computer makes its move
    const computerMove = () => {
        const move = findBestMove();
        if (move !== -1) makeMove(move);
    };

    // Find the best move for the computer
    const findBestMove = () => {
        // 1. Check for a winning move
        const winningMove = findWinningMove('O');
        if (winningMove !== -1) return winningMove;

        // 2. Block the opponent's winning move
        const blockingMove = findWinningMove('X');
        if (blockingMove !== -1) return blockingMove;

        // 3. Strategic moves
        if (boardSize === 3) {
            return getBestMoveFor3x3();
        } else {
            return getBestMoveForLargerBoards();
        }
    };

    // Check for a winning or blocking move
    const findWinningMove = (player) => {
        const winPatterns = generateWinPatterns();
        for (let pattern of winPatterns) {
            const playerCells = pattern.filter(index => board[index] === player);
            const emptyCells = pattern.filter(index => board[index] === null);

            if (playerCells.length === pattern.length - 1 && emptyCells.length === 1) {
                return emptyCells[0];
            }
        }
        return -1;
    };

    // Get the best move for a 3x3 board
    const getBestMoveFor3x3 = () => {
        const center = Math.floor(board.length / 2);
        const corners = [0, 2, 6, 8];
        const sides = [1, 3, 5, 7];

        if (board[center] === null) return center;

        const availableCorners = corners.filter(index => board[index] === null);
        if (availableCorners.length > 0) {
            return availableCorners[Math.floor(Math.random() * availableCorners.length)];
        }

        const availableSides = sides.filter(index => board[index] === null);
        if (availableSides.length > 0) {
            return availableSides[Math.floor(Math.random() * availableSides.length)];
        }

        return -1;
    };

    // Get the best move for larger boards
    const getBestMoveForLargerBoards = () => {
        const center = Math.floor(board.length / 2);
        const corners = [
            0,
            boardSize - 1,
            board.length - boardSize,
            board.length - 1
        ];

        if (board[center] === null) return center;

        const availableCorners = corners.filter(index => board[index] === null);
        if (availableCorners.length > 0) {
            return availableCorners[Math.floor(Math.random() * availableCorners.length)];
        }

        const emptyCells = board.map((val, index) => (val === null ? index : null)).filter(val => val !== null);
        return emptyCells[Math.floor(Math.random() * emptyCells.length)];
    };

    // Reset the game to its initial state
    const resetGame = () => {
        board = Array(boardSize * boardSize).fill(null);
        document.querySelectorAll('.cell').forEach(cell => (cell.textContent = ''));
        currentPlayer = 'X';
        isGameActive = true;
        updateStatus();
    };

    // Generate win patterns for the current board size
    const generateWinPatterns = () => {
        const patterns = [];

        // Rows
        for (let i = 0; i < boardSize; i++) {
            const row = [];
            for (let j = 0; j < boardSize; j++) {
                row.push(i * boardSize + j);
            }
            patterns.push(row);
        }

        // Columns
        for (let i = 0; i < boardSize; i++) {
            const col = [];
            for (let j = 0; j < boardSize; j++) {
                col.push(j * boardSize + i);
            }
            patterns.push(col);
        }

        // Diagonals
        const diag1 = [];
        const diag2 = [];
        for (let i = 0; i < boardSize; i++) {
            diag1.push(i * boardSize + i);
            diag2.push(i * boardSize + (boardSize - i - 1));
        }
        patterns.push(diag1, diag2);

        return patterns;
    };

    // Set the board size and reset the game
    const setBoardSize = (size) => {
        boardSize = size;
        createBoard();
    };

    // Event Listeners
    resetButton.addEventListener('click', resetGame);

    boardSizeLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const size = parseInt(link.getAttribute('data-size'), 10);
            setBoardSize(size);
        });
    });

    gameModeSelect.addEventListener('change', () => {
        gameMode = gameModeSelect.value;
        resetGame();
    });

    // Initialize the game
    createBoard();
});
