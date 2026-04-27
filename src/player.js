import { gameBoard } from './gameboard.js';

export function player(name, type = 'human') {
	const board = gameBoard();

	const attack = (enemyBoard, x, y) => {
		return enemyBoard.receiveAttack(x, y);
	};

	const randomAttack = (enemyBoard) => {
		let x, y, result;

		do {
			x = Math.floor(Math.random() * 10);
			y = Math.floor(Math.random() * 10);
			result = enemyBoard.receiveAttack(x, y);
		} while (result === 'already attacked');

		return { x, y, result };
	};

	return { board, name, type, attack, randomAttack };
}
