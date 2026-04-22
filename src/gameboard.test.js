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

	test('reports true when all ships are sunk', () => {
		const board = gameBoard();

		const patrol = board.ships[0];
		const submarine = board.ships[1];
		const destroyer = board.ships[2];
		const battleship = board.ships[3];
		const carrier = board.ships[4];

		board.placeShip(patrol, 0, 0, 'horizontal');
		board.placeShip(submarine, 0, 1, 'horizontal');
		board.placeShip(destroyer, 0, 2, 'horizontal');
		board.placeShip(battleship, 0, 3, 'horizontal');
		board.placeShip(carrier, 0, 4, 'horizontal');

		board.receiveAttack(0, 0);
		board.receiveAttack(1, 0);

		board.receiveAttack(0, 1);
		board.receiveAttack(1, 1);
		board.receiveAttack(2, 1);

		board.receiveAttack(0, 2);
		board.receiveAttack(1, 2);
		board.receiveAttack(2, 2);

		board.receiveAttack(0, 3);
		board.receiveAttack(1, 3);
		board.receiveAttack(2, 3);
		board.receiveAttack(3, 3);

		board.receiveAttack(0, 4);
		board.receiveAttack(1, 4);
		board.receiveAttack(2, 4);
		board.receiveAttack(3, 4);
		board.receiveAttack(4, 4);

		expect(board.allSunk()).toBe(true);
	});

	test('reports false when some ships are still afloat', () => {
		const board = gameBoard();

		const patrol = board.ships[0];
		const submarine = board.ships[1];
		const destroyer = board.ships[2];
		const battleship = board.ships[3];
		const carrier = board.ships[4];

		board.placeShip(patrol, 0, 0, 'horizontal');
		board.placeShip(submarine, 0, 1, 'horizontal');
		board.placeShip(destroyer, 0, 2, 'horizontal');
		board.placeShip(battleship, 0, 3, 'horizontal');
		board.placeShip(carrier, 0, 4, 'horizontal');

		board.receiveAttack(0, 0);
		board.receiveAttack(1, 0);

		board.receiveAttack(0, 1);
		board.receiveAttack(1, 1);
		board.receiveAttack(2, 1);

		board.receiveAttack(0, 2);
		board.receiveAttack(1, 2);
		board.receiveAttack(2, 2);

		board.receiveAttack(0, 3);
		board.receiveAttack(1, 3);
		board.receiveAttack(2, 3);
		board.receiveAttack(3, 3);

		board.receiveAttack(0, 4);
		board.receiveAttack(1, 4);
		board.receiveAttack(2, 4);
		board.receiveAttack(3, 4);
		board.receiveAttack(6, 4);

		expect(board.allSunk()).toEqual(false);
	});
});
