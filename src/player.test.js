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
});
