import { gameBoard } from './gameboard.js';

export function player(name) {
	const board = gameBoard();
	const playerName = name;

	const attack = (enemyBoard, x, y) => {
		enemyBoard.receiveAttack(x, y);
	};

	return { board, playerName, attack };
}
