import { ship } from './ship.js';

describe('ship factory', () => {
	test('initializes with the correct length', () => {
		const myShip = ship(3);
		expect(myShip.length).toBe(3);
	});

	test('starts with 0 hits', () => {
		const myShip = ship(3);
		expect(myShip.hits).toBe(0);
	});

	test('isSunk() returns true if hits equal length', () => {
		const myShip = ship(2);
		myShip.hit();
		myShip.hit();
		expect(myShip.isSunk()).toBe(true);
	});
});
