import { ship } from './ship.js';

export function gameBoard() {
	const board = [];
	for (let i = 0; i < 10; i++) {
		board[i] = [];
		for (let j = 0; j < 10; j++) {
			board[i][j] = null;
		}
	}

	const shipsSizes = [2, 3, 3, 4, 5];
	const ships = [];

	for (let i = 0; i < 5; i++) {
		ships.push(ship(shipsSizes[i]));
	}

	const placeShip = (ship, x, y, orientation) => {
		if (orientation === 'horizontal') {
			for (let i = x; i < x + ship.length; i++) {
				board[x + i][y] = ship;
			}
		} else {
			for (let i = y; i < y + ship.length; i++) {
				board[x][y + i] = ship;
			}
		}
	};

	const getSquare = (x, y) => {
		return board[x][y];
	};

	const receiveAttack = (x, y) => {
		if (board[x][y] !== null) {
			return true;
		} else {
			return false;
		}
	};

	return { ships, placeShip, getSquare, receiveAttack };
}
