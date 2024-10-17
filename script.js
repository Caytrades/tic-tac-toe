		let board = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X';
let gameMode = 'human';
let humanSymbol = 'X';
let aiSymbol = 'O';
let player1Score = 0;
let player2Score = 0;

const cells = document.querySelectorAll('.cell');
const resetButton = document.getElementById('resetButton');
const modeSelect = document.getElementById('mode');
const symbolSelect = document.getElementById('symbol');
const player1ScoreDisplay = document.getElementById('player1Score');
const player2ScoreDisplay = document.getElementById('player2Score');

const winningCombos = [
	[0, 1, 2],
	[3, 4, 5],
	[6, 7, 8],
	[0, 3, 6],
	[1, 4, 7],
	[2, 5, 8],
	[0, 4, 8],
	[2, 4, 6]
];

cells.forEach(cell => cell.addEventListener('click', handleCellClick));
resetButton.addEventListener('click', resetGame);
modeSelect.addEventListener('change', (e) => {
	gameMode = e.target.value;
	if (gameMode === 'ai') {
		player2ScoreDisplay.textContent = 'AI: ' + player2Score;
	} else {
		player2ScoreDisplay.textContent = 'Player 2: ' + player2Score;
	}
});
symbolSelect.addEventListener('change', (e) => {
	humanSymbol = e.target.value;
	aiSymbol = humanSymbol === 'X' ? 'O' : 'X';
	resetGame();
});

function handleCellClick(e) {
	const index = e.target.getAttribute('data-index');
	if (board[index] === '') {
		board[index] = currentPlayer;
		e.target.textContent = currentPlayer;
		if (checkWin(currentPlayer)) {
			updateScore(currentPlayer);
			setTimeout(() => alert(`${currentPlayer} wins!`), 100);
			resetBoard();
		} else if (board.every(cell => cell !== '')) {
			setTimeout(() => alert('Draw!'), 100);
			resetBoard();
		} else {
			switchPlayer();
			if (gameMode === 'ai' && currentPlayer === aiSymbol) {
				setTimeout(aiMove, 500);  // Adding a small delay for better UX
			}
		}
	}
}

function switchPlayer() {
	currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
}

function checkWin(player) {
	return winningCombos.some(combo => combo.every(index => board[index] === player));
}

function resetBoard() {
	board = ['', '', '', '', '', '', '', '', ''];
	cells.forEach(cell => cell.textContent = '');
	currentPlayer = humanSymbol;
}

function resetGame() {
	resetBoard();
	player1Score = 0;
	player2Score = 0;
	updateScoreDisplay();
}

function updateScore(player) {
	if (player === humanSymbol) {
		player1Score++;
	} else {
		player2Score++;
	}
	updateScoreDisplay();
}

function updateScoreDisplay() {
	player1ScoreDisplay.textContent = `Player 1: ${player1Score}`;
	if (gameMode === 'ai') {
		player2ScoreDisplay.textContent = `AI: ${player2Score}`;
	} else {
		player2ScoreDisplay.textContent = `Player 2: ${player2Score}`;
	}
}

function aiMove() {
	const bestMove = minimax(board, aiSymbol, -Infinity, Infinity).index;
	board[bestMove] = aiSymbol;
	cells[bestMove].textContent = aiSymbol;
	if (checkWin(aiSymbol)) {
		updateScore(aiSymbol);
		setTimeout(() => alert(`${aiSymbol} wins!`), 100);
		resetBoard();
	} else if (board.every(cell => cell !== '')) {
		setTimeout(() => alert('Draw!'), 100);
		resetBoard();
	} else {
		switchPlayer();
	}
}

function minimax(newBoard, player, alpha, beta) {
	const emptyCells = newBoard.map((cell, index) => cell === '' ? index : null).filter(index => index !== null);

	if (checkWin(humanSymbol)) {
		return { score: -10 };
	} else if (checkWin(aiSymbol)) {
		return { score: 10 };
	} else if (emptyCells.length === 0) {
		return { score: 0 };
	}

	const moves = [];
	for (let i = 0; i < emptyCells.length; i++) {
		const index = emptyCells[i];
		const move = { index: index };
		newBoard[index] = player;

		if (player === aiSymbol) {
			move.score = minimax(newBoard, humanSymbol, alpha, beta).score;
			if (move.score > alpha) {
				alpha = move.score;
			}
		} else {
			move.score = minimax(newBoard, aiSymbol, alpha, beta).score;
			if (move.score < beta) {
				beta = move.score;
			}
		}

		newBoard[index] = '';
		moves.push(move);

		if (player === aiSymbol && beta <= alpha) break; // beta cut-off
		if (player === humanSymbol && beta <= alpha) break; // alpha cut-off
	}

	let bestMove;
	if (player === aiSymbol) {
		let bestScore = -Infinity;
		for (let i = 0; i < moves.length; i++) {
			if (moves[i].score > bestScore) {
				bestScore = moves[i].score;
				bestMove = moves[i];
			}
		}
	} else {
		let bestScore = Infinity;
		for (let i = 0; i < moves.length; i++) {
			if (moves[i].score < bestScore) {
				bestScore = moves[i].score;
				bestMove = moves[i];
			}
		}
	}

	return bestMove;
}
