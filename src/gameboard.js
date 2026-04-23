import { ship } from './ship.js';

export function gameBoard() {
	const missedShots = [];
	const board = Array.from({ length: 10 }, () => Array(10).fill(null));

	const getSquare = (x, y) => {
		return board[x][y];
	};

	const shipsSizes = [2, 3, 3, 4, 5];
	const ships = [];

	for (let i = 0; i < 5; i++) {
		ships.push(ship(shipsSizes[i]));
	}

	const placeShip = (ship, x, y, orientation) => {
		if (outOfBoard(ship.length, x, y)) return 'out of board';

		for (let i = 0; i < ship.length; i++) {
			if (orientation === 'horizontal') {
				board[x + i][y] = ship;
			} else {
				board[x][y + i] = ship;
			}
		}
	};

	const outOfBoard = (len, x, y) => {
		if (len + x > 10 || len + y > 10) return true;
	};

	const receiveAttack = (x, y) => {
		const target = board[x][y];

		if (target !== null) {
			target.hit();
			return true;
		} else {
			missedShots.push([x, y]);
			return false;
		}
	};

	const allSunk = () => {
		return ships.every((ship) => ship.isSunk());
	};

	const getMissedShots = () => missedShots;

	return {
		ships,
		placeShip,
		getSquare,
		receiveAttack,
		getMissedShots,
		allSunk,
	};
}
