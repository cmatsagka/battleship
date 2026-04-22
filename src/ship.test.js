import { ship } from './ship.js';

describe('ship factory', () => {
	test('initializes with the correct length', () => {
		const myShip = ship(3);
		expect(myShip.length).toBe(3);
	});
});

describe('ship factory', () => {
	test('starts with 0 hits', () => {
		const myShip = ship(3);
		expect(myShip.hits).toBe(0);
	});
});
