import { player } from './player.js';
import { gameBoard } from './gameboard.js';

describe('player factory', () => {
	test('each player has their own gameboard and name', () => {
		const p1 = player('Player 1');
		expect(p1.board).toBeDefined();
		expect(p1.playerName).toBe('Player 1');

		const p2 = player('Computer');
		expect(p2.board).toBeDefined();
		expect(p2.playerName).toBe('Computer');
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
		const computer = player('Computer');

		computer.randomAttack(p1.board);

		const totalMoves = p1.board.getMissedShots().length;
		expect(totalMoves).toBe(1);
	});
});
