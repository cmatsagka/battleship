import { ship } from './ship.js';

const SHIP_SIZES = [2, 3, 3, 4, 5];
const SHIP_NAMES = [
	'Patrol Boat',
	'Submarine',
	'Destroyer',
	'Battleship',
	'Carrier',
];

export function gameBoard() {
	let missedShots = [];
	let hitShots = [];
	let board = Array.from({ length: 10 }, () => Array(10).fill(null));
	let ships = [];

	const initializeShips = () => {
		ships = [];
		for (let i = 0; i < 5; i++) {
			ships.push(ship(SHIP_SIZES[i], SHIP_NAMES[i]));
		}
	};

	const resetBoard = () => {
		board = Array.from({ length: 10 }, () => Array(10).fill(null));
		missedShots = [];
		hitShots = [];
		initializeShips();
	};

	const getSquare = (x, y) => board[x][y];

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

		if (target === 'miss' || target === 'hit')
			return 'You already attacked here!';

		if (target !== null) {
			target.hit();

			const isSunk = target.isSunk();
			const shipName = target.name;

			board[x][y] = 'hit';
			hitShots.push([x, y]);

			return { hit: true, sunk: isSunk, shipName: shipName };
		} else {
			board[x][y] = 'miss';
			missedShots.push([x, y]);
			return { hit: false, sunk: false };
		}
	};

	const allSunk = () => ships.every((ship) => ship.isSunk());

	const getMissedShots = () => missedShots;

	const getHitShots = () => hitShots;

	const removeShipFromDataMatrix = (shipName) => {
		for (let x = 0; x < 10; x++) {
			for (let y = 0; y < 10; y++) {
				if (board[x][y] && board[x][y].name === shipName) {
					board[x][y] = null;
				}
			}
		}
	};

	initializeShips();

	return {
		ships,
		resetBoard,
		isValidPlacement,
		placeShip,
		getSquare,
		receiveAttack,
		getMissedShots,
		getHitShots,
		allSunk,
		removeShipFromDataMatrix,
	};
}
