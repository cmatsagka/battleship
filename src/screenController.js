import { gameboard } from './gameboard';

export function createBoard(gameboard, parentElement, isHidden) {
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
}
