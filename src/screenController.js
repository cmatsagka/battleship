import { gameBoard } from './gameBoard.js';
import { gameController } from './gameController.js';

export function screenController() {
	const p1BoardDOM = document.querySelector('#human-board');
	const compBoardDOM = document.querySelector('#comp-board');
	const humanMessage = document.querySelector('#human-message');
	const compMessage = document.querySelector('#comp-message');
	const restartBtn = document.querySelector('#restart-btn');

	let game;
	let isComputerThinking;

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
		isComputerThinking = false;

		humanMessage.textContent = 'New game started! Your turn!';
		compMessage.textContent = '';
		restartBtn.style.display = 'none';

		game.p1.board.placeShip(game.p1.board.ships[0], 0, 0, 'horizontal');
		game.p1.board.placeShip(game.p1.board.ships[1], 4, 2, 'horizontal');
		game.p1.board.placeShip(game.p1.board.ships[2], 4, 5, 'vertical');
		game.p1.board.placeShip(game.p1.board.ships[3], 7, 5, 'vertical');
		game.p1.board.placeShip(game.p1.board.ships[4], 2, 3, 'vertical');

		game.placeComputerShips();

		createBoard(game.p1.board, p1BoardDOM, false);
		createBoard(game.comp.board, compBoardDOM, true);
	};

	compBoardDOM.addEventListener('click', (e) => {
		if (!e.target.classList.contains('square')) return;
		if (game.isGameOver() || isComputerThinking) return;

		const x = parseInt(e.target.dataset.x);
		const y = parseInt(e.target.dataset.y);

		const roundResult = game.playRound(x, y);

		if (typeof roundResult === 'string') {
			humanMessage.textContent = roundResult;
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
			restartBtn.style.display = 'block';
			return;
		}

		isComputerThinking = true;

		setTimeout(() => {
			const compRoundResult = game.playComputerTurn();

			if (typeof compRoundResult === 'string') {
				compMessage.textContent = compRoundResult;
			} else {
				const compHit = compRoundResult.compResult.result;

				if (compHit.sunk) {
					compMessage.textContent = `MAYDAY! Computer sank your ${compHit.shipName}!`;
				} else {
					compMessage.textContent = compHit.hit
						? `Computer hit your ${compHit.shipName}!`
						: 'Computer missed.';
				}
			}

			if (game.isGameOver() && game.p1.board.allSunk()) {
				compMessage.textContent = 'Computer wins!';
				restartBtn.style.display = 'block';
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
