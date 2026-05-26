import { gameBoard } from './gameBoard.js';
import { gameController } from './gameController.js';
import { player } from './player.js';

export function screenController() {
	const p1BoardDOM = document.querySelector('#human-board');
	const compBoardDOM = document.querySelector('#comp-board');
	const humanMessage = document.querySelector('#human-message');
	const compMessage = document.querySelector('#comp-message');
	const restartBtn = document.querySelector('#restart-btn');
	const randomP1Btn = document.querySelector('#random-p1-btn');
	const startMatchBtn = document.querySelector('#start-match-btn');

	let game;
	let isComputerThinking;
	let isGameStarted;

	const randomizePlayerShips = (playerObject, boardDOM, isHidden) => {
		playerObject.board.resetBoard();

		playerObject.board.ships.forEach((ship) => {
			let placed = false;

			while (!placed) {
				const x = Math.floor(Math.random() * 10);
				const y = Math.floor(Math.random() * 10);
				const orientation =
					Math.random() > 0.5 ? 'horizontal' : 'vertical';

				if (playerObject.board.placeShip(ship, x, y, orientation)) {
					placed = true;
				}
			}
		});

		createBoard(playerObject.board, boardDOM, isHidden);
	};

	randomP1Btn.addEventListener('click', () => {
		randomizePlayerShips(game.p1, p1BoardDOM, false);
		startMatchBtn.classList.remove('hidden');
	});

	startMatchBtn.addEventListener('click', () => {
		randomP1Btn.classList.add('hidden');
		startMatchBtn.classList.add('hidden');
		isGameStarted = true;

		humanMessage.textContent = 'Fleet deployed! Your turn to attack!';
	});

	const createBoard = (gameBoard, parentElement, isHidden) => {
		parentElement.textContent = '';

		for (let x = 0; x < 10; x++) {
			for (let y = 0; y < 10; y++) {
				const square = document.createElement('div');
				square.dataset.x = x;
				square.dataset.y = y;
				square.classList.add('square');

				const targetState = gameBoard.getSquare(x, y);

				if (targetState === 'miss') {
					square.classList.add('miss');
				} else if (targetState === 'hit') {
					square.classList.add('hit');
				} else if (targetState !== null && !isHidden) {
					square.classList.add('ship');
				} else {
					square.classList.add('sea');
				}

				parentElement.appendChild(square);
			}
		}
	};

	const startNewGame = () => {
		game = gameController();
		isGameStarted = false;
		isComputerThinking = false;

		humanMessage.textContent = 'Deploy your fleet! Click Randomize Fleet.';
		compMessage.textContent = '';
		restartBtn.classList.add('hidden');

		randomP1Btn.classList.remove('hidden');
		startMatchBtn.classList.add('hidden');

		game.placeComputerShips();

		createBoard(game.p1.board, p1BoardDOM, false);
		createBoard(game.comp.board, compBoardDOM, true);
	};

	compBoardDOM.addEventListener('click', (e) => {
		if (!isGameStarted) return;
		if (!e.target.classList.contains('square')) return;
		if (game.isGameOver() || isComputerThinking) return;

		const x = parseInt(e.target.dataset.x);
		const y = parseInt(e.target.dataset.y);

		const roundResult = game.playRound(x, y);

		if (typeof roundResult === 'string') {
			humanMessage.textContent = roundResult;
			if (game.isGameOver()) restartBtn.classList.remove('hidden');
			return;
		}

		const humanHit = roundResult.humanResult;

		if (humanHit.sunk) {
			humanMessage.textContent = `BOOM! You sank the computer's ${humanHit.shipName}!`;
		} else {
			humanMessage.textContent = humanHit.hit
				? `You hit their ${humanHit.shipName}!`
				: 'You missed!';
		}

		compMessage.textContent = 'Computer is planning...';

		createBoard(game.p1.board, p1BoardDOM, false);
		createBoard(game.comp.board, compBoardDOM, true);

		if (game.isGameOver()) {
			humanMessage.textContent = 'Human Wins!';
			compMessage.textContent = '';
			restartBtn.classList.remove('hidden');
			return;
		}

		isComputerThinking = true;

		setTimeout(() => {
			const compRoundResult = game.playComputerTurn();

			if (typeof compRoundResult === 'string') {
				compMessage.textContent = compRoundResult;
				if (game.isGameOver()) restartBtn.classList.remove('hidden');
				return;
			} else {
				const compHit = compRoundResult.compResult;

				if (compHit.sunk) {
					compMessage.textContent = `MAYDAY! Computer sank your ${compHit.shipName}!`;
				} else {
					compMessage.textContent = compHit.hit
						? `Computer hit your ${compHit.shipName}!`
						: 'Computer missed.';
				}
			}

			createBoard(game.p1.board, p1BoardDOM, false);
			createBoard(game.comp.board, compBoardDOM, true);

			isComputerThinking = false;
		}, 1000);
	});

	restartBtn.addEventListener('click', () => {
		startNewGame();
	});

	startNewGame();
}
