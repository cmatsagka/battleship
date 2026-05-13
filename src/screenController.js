import { gameBoard } from './gameboard.js';
import { gameController } from './gameController.js';

export function screenController() {
	const createBoard = (gameboard, parentElement, isHidden) => {
		parentElement.textContent = '';

		for (let x = 0; x < 10; x++) {
			for (let y = 0; y < 10; y++) {
				const square = document.createElement('div');
				square.dataset.x = x;
				square.dataset.y = y;
				square.classList.add('square');

				const isMiss = gameboard
					.getMissedShots()
					.some((miss) => miss[0] === x && miss[1] === y);

				const isHit = gameboard
					.getHitShots()
					.some((hit) => hit[0] === x && hit[1] === y);

				const shipFound = gameboard.getSquare(x, y);

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

	const messageCenter = document.querySelector('.message-center');

	comp.addEventListener('click', (e) => {
		if (!e.target.classList.contains('square')) return;

		const x = parseInt(e.target.dataset.x);
		const y = parseInt(e.target.dataset.y);

		const roundResult = game.playRound(x, y);

		if (typeof roundResult === 'object') {
			const humanHit = roundResult.humanResult
				? 'You hit!'
				: 'You missed!';
			const compHit = roundResult.compResult.result
				? 'Computer hit!'
				: 'Computer missed!';
			messageCenter.textContent = `${humanHit} ${compHit}`;
		} else {
			messageCenter.textContent = 'Battle in progress...';
		}

		createBoard(game.p1.board, p1, false);
		createBoard(game.comp.board, comp, true);
	});
}
