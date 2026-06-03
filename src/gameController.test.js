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

	describe('drag n drop state edge cases', () => {
		test('removing a ship from data matrix leaves cells empty', () => {
			const game = gameController();
			const ship = game.p1.board.ships[0];

			game.p1.board.placeShip(ship, 2, 2, 'horizontal');
			expect(game.p1.board.getSquare(2, 2)).not.toBeNull();

			game.p1.board.removeShipFromDataMatrix(ship.name);
			expect(game.p1.board.getSquare(2, 2)).toBeNull();
		});
	});

	describe('hit-tracking validation', () => {
		test('playRound correctly handles and reports a hit on an enemy ship', () => {
			const game = gameController();
			game.comp.board.resetBoard();

			const targetShip = game.comp.board.ships[0];
			game.comp.board.placeShip(targetShip, 0, 0, 'horizontal');

			const result = game.playRound(0, 0);

			expect(result.humanResult.hit).toBe(true);
			expect(game.comp.board.getSquare(0, 0)).toBe('hit');
		});
	});

	describe('computer intelligence when attacking', () => {
		test('computer AI never attacks the same coordinate twice', () => {
			const game = gameController();
			game.p1.board.resetBoard();

			for (let x = 0; x < 10; x++) {
				for (let y = 0; y < 10; y++) {
					if (x === 9 && y === 9) continue;
					game.p1.board.receiveAttack(x, y);
				}
			}

			game.playComputerTurn();

			const lastCell = game.p1.board.getSquare(9, 9);
			expect(['miss', 'hit']).toContain(lastCell);
		});
	});
});
