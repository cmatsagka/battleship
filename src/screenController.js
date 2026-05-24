import { gameBoard } from './gameBoard.js';
import { gameController } from './gameController.js';

export function screenController() {
	const createBoard = (gameBoard, parentElement, isHidden) => {
		parentElement.textContent = '';

		for (let x = 0; x < 10; x++) {
			for (let y = 0; y < 10; y++) {
				const square = document.createElement('div');
				square.dataset.x = x;
				square.dataset.y = y;
				square.classList.add('square');

				const isMiss = gameBoard
					.getMissedShots()
					.some((miss) => miss[0] === x && miss[1] === y);

				const isHit = gameBoard
					.getHitShots()
					.some((hit) => hit[0] === x && hit[1] === y);

				const shipFound = gameBoard.getSquare(x, y);

				if (isMiss) {
					square.classList.add('miss');
				} else if (isHit) {
					square.classList.add('hit');
				} else if (shipFound !== null && !isHidden) {
					square.classList.add('ship');
				} else {
					square.classList.add('sea');
				}

				parentElement.appendChild(square);
			}
		}
	};

	const game = gameController();

	game.p1.board.placeShip(game.p1.board.ships[0], 0, 0, 'horizontal');
	game.p1.board.placeShip(game.p1.board.ships[1], 4, 2, 'horizontal');
	game.p1.board.placeShip(game.p1.board.ships[2], 4, 5, 'vertical');
	game.p1.board.placeShip(game.p1.board.ships[3], 7, 5, 'vertical');
	game.p1.board.placeShip(game.p1.board.ships[4], 2, 3, 'vertical');

	game.placeComputerShips();

	const p1 = document.querySelector('#human-board');
	const comp = document.querySelector('#comp-board');

	createBoard(game.p1.board, p1, false);
	createBoard(game.comp.board, comp, true);

	const humanMessage = document.querySelector('#human-message');
	const compMessage = document.querySelector('#comp-message');

	comp.addEventListener('click', (e) => {
		if (!e.target.classList.contains('square')) return;
		if (game.isGameOver()) return;

		const x = parseInt(e.target.dataset.x);
		const y = parseInt(e.target.dataset.y);

		const roundResult = game.playRound(x, y);

		if (typeof roundResult === 'string') {
			humanMessage.textContent = roundResult;
			compMessage.textContent = '';
		} else if (typeof roundResult === 'object') {
			const humanHit = roundResult.humanResult;
			const compHit = roundResult.compResult.result;

			if (humanHit.sunk) {
				humanMessage.textContent = `BOOM! You sank the computer's ${humanHit.shipName}!`;
			} else {
				humanMessage.textContent = humanHit.hit
					? `You hit their ${humanHit.shipName}!`
					: 'You missed!';
			}

			let compText = compHit.hit
				? `Computer hit your ${compHit.shipName}!`
				: 'Computer missed.';
			if (compHit.sunk) {
				compMessage.textContent = `MAYDAY! Computer sank your ${compHit.shipName}!`;
			} else {
				compMessage.textContent = compHit.hit
					? `Computer hit your ${compHit.shipName}!`
					: 'Computer missed.';
			}
		}

		createBoard(game.p1.board, p1, false);
		createBoard(game.comp.board, comp, true);
	});
}
