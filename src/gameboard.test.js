import { gameBoard } from './gameboard.js';

describe('gameBoard factory', () => {
	test('initializes with a fleet of 5 ships', () => {
		const board = gameBoard();
		expect(board.ships.length).toBe(5);
	});

	describe('ship placement', () => {
		test('places a ship at specific horizontal coordinates', () => {
			const board = gameBoard();
			const carrier = board.ships[4];

			board.placeShip(carrier, 0, 0, 'horizontal');
			expect(board.getSquare(0, 0)).toBe(carrier);
			expect(board.getSquare(1, 0)).toBe(carrier);
			expect(board.getSquare(5, 0)).toBe(null);
		});

		test('places a ship at specific vertical coordinates', () => {
			const board = gameBoard();
			const battleship = board.ships[3];

			board.placeShip(battleship, 0, 0, 'vertical');
			expect(board.getSquare(0, 0)).toBe(battleship);
			expect(board.getSquare(0, 3)).toBe(battleship);
			expect(board.getSquare(0, 5)).toBe(null);
		});

		test('places a ship out of board', () => {
			const board = gameBoard();
			const battleship = board.ships[3];

			const result = board.placeShip(battleship, 0, 8, 'vertical');
			expect(result).toBe('out of board');
		});
	});

	describe('receiveAttack', () => {
		test('receives attack when coordinates match', () => {
			const board = gameBoard();
			const sub = board.ships[0];
			board.placeShip(sub, 0, 0, 'horizontal');

			board.receiveAttack(0, 0);
			expect(sub.getHits()).toBe(1);
		});

		test('records missed shots when coordinates are empty', () => {
			const board = gameBoard();
			board.receiveAttack(5, 5);
			expect(board.getMissedShots()).toContainEqual([5, 5]);
		});
	});

	describe('allSunk status', () => {
		test('reports true when entire fleet is destroyed', () => {
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
});
