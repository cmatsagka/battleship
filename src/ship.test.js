import { ship } from './ship.js';

describe('ship factory', () => {
	test('initializes with the correct length', () => {
		const myShip = ship(3);
		expect(myShip.length).toBe(3);
	});

	test('starts with 0 hits', () => {
		const myShip = ship(3);
		expect(myShip.getHits()).toBe(0);
	});

	test('increases the number of hits when hit() is called', () => {
		const myShip = ship(3);
		myShip.hit();
		expect(myShip.getHits()).toBe(1);
	});

	test('isSunk() returns true if hits equal length', () => {
		const myShip = ship(2);
		myShip.hit();
		myShip.hit();
		expect(myShip.isSunk()).toBe(true);
	});
});
