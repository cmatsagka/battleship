import { gameBoard } from './gameBoard.js';
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
		game.p1.board.resetBoard();
		game.comp.board.resetBoard();

		game.playRound(0, 0);

		if (typeof game.playComputerTurn === 'function') {
			game.playComputerTurn();
		}

		let totalAttacksOnP1 = 0;
		for (let x = 0; x < 10; x++) {
			for (let y = 0; y < 10; y++) {
				if (
					game.p1.board.getSquare(x, y) === 'miss' ||
					game.p1.board.getSquare(x, y) === 'hit'
				) {
					totalAttacksOnP1++;
				}
			}
		}

		expect(totalAttacksOnP1).toBe(1);
	});

	test('computer does not move if human choice is invalid', () => {
		const game = gameController();
		game.p1.board.resetBoard();
		game.comp.board.resetBoard();
		game.playRound(0, 0);

		if (typeof game.playComputerTurn === 'function') {
			game.playComputerTurn();
		}

		const result = game.playRound(0, 0);
		expect(result).toBe('You already attacked here!');

		let totalAttacksOnP1 = 0;
		for (let x = 0; x < 10; x++) {
			for (let y = 0; y < 10; y++) {
				if (
					game.p1.board.getSquare(x, y) === 'miss' ||
					game.p1.board.getSquare(x, y) === 'hit'
				) {
					totalAttacksOnP1++;
				}
			}
		}
		expect(totalAttacksOnP1).toBe(1);
	});

	test('game ends when a player fleet is sunk', () => {
		const game = gameController();
		game.comp.board.resetBoard();

		game.comp.board.ships.forEach((ship, index) => {
			game.comp.board.placeShip(ship, 0, index, 'horizontal');

			for (let i = 0; i < ship.length; i++) {
				game.playRound(i, index);
			}
		});

		expect(game.isGameOver()).toBe(true);
	});

	describe('Computer Random Placement', () => {
		test('all 5 ships are placed on the board', () => {
			const game = gameController();
			game.comp.board.resetBoard();
			game.placeComputerShips();

			const board = game.comp.board;
			let placedShipCells = 0;

			for (let x = 0; x < 10; x++) {
				for (let y = 0; y < 10; y++) {
					if (board.getSquare(x, y) !== null) {
						placedShipCells++;
					}
				}
			}

			const expectedCells = board.ships.reduce(
				(acc, ship) => acc + ship.length,
				0
			);

			expect(placedShipCells).toBe(expectedCells);
		});

		test('ships do not overlap or go out of bounds', () => {
			const game = gameController();
			game.comp.board.resetBoard();

			const result = game.placeComputerShips();

			expect(result).toBe(true);
		});
	});
});
