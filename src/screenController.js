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
	game.placeComputerShips();

	const p1 = document.querySelector('#human-board');
	const comp = document.querySelector('#comp-board');

	createBoard(game.p1.board, p1, false);
	createBoard(game.comp.board, comp, true);
}
