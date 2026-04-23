import { player } from './player.js';
import { gameBoard } from './gameboard.js';

describe('player factory', () => {
	test('each player has their own gameboard', () => {
		const p1 = player('Player 1');
		expect(p1.board).toBeDefined();
	});
});
