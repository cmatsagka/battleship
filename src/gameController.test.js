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

	test('computer makes a counter-attack after human move', () => {
		const game = gameController();
		game.playRound(0, 0);

		const p1Misses = game.p1.board.getMissedShots().length;
		expect(p1Misses).toBe(1);
	});

	test('computer does not move if human choice is invalid', () => {
		const game = gameController();
		game.playRound(0, 0);

		const result = game.playRound(0, 0);
		expect(result).toBe('already attacked');
		expect(game.p1.board.getMissedShots().length).toBe(1);
	});

	test('game ends when a player fleet is sunk', () => {
		const game = gameController();

		game.comp.board.ships.forEach((ship, index) => {
			game.comp.board.placeShip(ship, 0, index, 'horizontal');

			for (let i = 0; i < ship.length; i++) {
				game.playRound(i, index);
			}
		});

		expect(game.isGameOver()).toBe(true);
	});
});
