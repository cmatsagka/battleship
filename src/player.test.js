import { player } from './player.js';
import { gameBoard } from './gameboard.js';

describe('player factory', () => {
	test('each player has their own gameboard and name', () => {
		const p1 = player('Player 1');
		expect(p1.board).toBeDefined();
		expect(p1.name).toBe('Player 1');

		const p2 = player('Computer');
		expect(p2.board).toBeDefined();
		expect(p2.name).toBe('Computer');
	});

	test('player can attack enemy board', () => {
		const p1 = player('Player 1');
		const p2 = player('Computer');

		p1.attack(p2.board, 5, 5);
		expect(p2.board.getMissedShots()).toContainEqual([5, 5]);
	});

	test('should not allow hitting the same coordinate twice', () => {
		const board = gameBoard();
		board.receiveAttack(0, 0);

		expect(board.receiveAttack(0, 0)).toBe('already attacked');
	});

	test('computer can make a random attack', () => {
		const p1 = player('Player 1');
		p1.board.placeShip(p1.board.ships[0], 0, 0, 'horizontal');
		p1.board.placeShip(p1.board.ships[1], 0, 1, 'horizontal');
		p1.board.placeShip(p1.board.ships[2], 0, 2, 'horizontal');
		p1.board.placeShip(p1.board.ships[3], 0, 3, 'horizontal');
		p1.board.placeShip(p1.board.ships[4], 0, 4, 'horizontal');

		const computer = player('Computer', 'computer');

		for (let i = 0; i < 100; i++) {
			computer.randomAttack(p1.board);
		}

		expect(p1.board.allSunk()).toBe(true);
	});
});
