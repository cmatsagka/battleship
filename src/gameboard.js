import { ship } from './ship.js';

export function gameBoard() {
	const missedShots = [];
	const hitShots = [];
	const board = Array.from({ length: 10 }, () => Array(10).fill(null));

	const getSquare = (x, y) => {
		return board[x][y];
	};

	const shipsSizes = [2, 3, 3, 4, 5];
	const ships = [];

	for (let i = 0; i < 5; i++) {
		ships.push(ship(shipsSizes[i]));
	}

	const isValidPlacement = (ship, x, y, orientation) => {
		if (orientation === 'horizontal') {
			if (ship.length + x > 10 || y > 9) return false;
		} else {
			if (ship.length + y > 10 || x > 9) return false;
		}

		for (let i = 0; i < ship.length; i++) {
			if (orientation === 'horizontal' && board[x + i][y] !== null) {
				return false;
			}
			if (orientation === 'vertical' && board[x][y + i] !== null) {
				return false;
			}
		}
		return true;
	};

	const placeShip = (ship, x, y, orientation) => {
		if (!isValidPlacement(ship, x, y, orientation)) return false;

		for (let i = 0; i < ship.length; i++) {
			if (orientation === 'horizontal') {
				board[x + i][y] = ship;
			} else {
				board[x][y + i] = ship;
			}
		}

		return true;
	};

	const receiveAttack = (x, y) => {
		const target = board[x][y];

		if (target === 'miss' || target === 'hit') return 'already attacked';

		if (target !== null) {
			target.hit();
			board[x][y] = 'hit';
			hitShots.push([x, y]);
			return true;
		} else {
			board[x][y] = 'miss';
			missedShots.push([x, y]);
			return false;
		}
	};

	const allSunk = () => {
		return ships.every((ship) => ship.isSunk());
	};

	const getMissedShots = () => missedShots;

	const getHitShots = () => hitShots;

	return {
		ships,
		isValidPlacement,
		placeShip,
		getSquare,
		receiveAttack,
		getMissedShots,
		getHitShots,
		allSunk,
	};
}
