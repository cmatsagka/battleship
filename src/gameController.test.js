import { gameBoard } from './gameboard.js';
import { player } from './player.js';
import { gameController } from './gameController.js';

describe('Game Controller is able to: ', () => {
	test('successfully switched turns', () => {
		const game = gameController();
		expect(game.getActivePlayer().name).toBe('Human');

		game.switchTurn();
		expect(game.getActivePlayer().name).toBe('Computer');
		game.switchTurn();
		expect(game.getActivePlayer().name).toBe('Human');
	});

	test('playRound correctly records a miss on the enemy board', () => {
		const game = gameController();
		game.playRound(5, 5);

		expect(game.comp.board.getMissedShots()).toContainEqual([5, 5]);
	});
});
