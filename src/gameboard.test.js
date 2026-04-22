import { gameBoard } from './gameboard.js';

describe('gameBoard factory', () => {
	test('creates ships', () => {
		const board = gameBoard();
		expect(board.ships.length).toBe(5);
	});

	test('places a ship at specific horizontal coordinates', () => {
		const board = gameBoard();
		const carrier = board.ships[4];

		board.placeShip(carrier, 0, 0, 'horizontal');
		expect(board.getSquare(0, 0)).toBe(carrier);
		expect(board.getSquare(1, 0)).toBe(carrier);
		expect(board.getSquare(2, 0)).toBe(carrier);
		expect(board.getSquare(3, 0)).toBe(carrier);
		expect(board.getSquare(4, 0)).toBe(carrier);
	});

	test('places a ship at specific vertical coordinates', () => {
		const board = gameBoard();
		const carrier = board.ships[3];

		board.placeShip(carrier, 0, 0, 'vertical');
		expect(board.getSquare(0, 0)).toBe(carrier);
		expect(board.getSquare(0, 1)).toBe(carrier);
		expect(board.getSquare(0, 2)).toBe(carrier);
	});

	test('receives attack and updates ship', () => {
		const board = gameBoard();
		const sub = board.ships[0];
		board.placeShip(sub, 0, 0, 'horizontal');

		board.receiveAttack(0, 0);
		expect(sub.getHits()).toBe(1);

		board.receiveAttack(5, 5);
		expect(board.getMissedShots()).toContainEqual([5, 5]);
	});
});
