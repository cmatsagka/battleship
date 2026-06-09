import { gameBoard } from './gameBoard.js';

export function player(name, type = 'human') {
	const board = gameBoard();

	const attack = (enemyBoard, x, y) => enemyBoard.receiveAttack(x, y);
	const randomAttack = (enemyBoard) => {
		let x, y, result;
		let attempts = 0;

		do {
			x = Math.floor(Math.random() * 10);
			y = Math.floor(Math.random() * 10);
			result = enemyBoard.receiveAttack(x, y);
			attempts++;
		} while (typeof result === 'string' && attempts < 500);

		return { x, y, result };
	};

	return { board, name, type, attack, randomAttack };
}
