import { ship } from './ship.js';

const ships = [];

export function gameBoard() {
	for (let i = 2; i < 6; i++) {
		ships.push(ship(i, 0, false));
	}
}

const receiveAttack = (x, y) => {};
