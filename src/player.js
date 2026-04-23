import { gameBoard } from './gameboard.js';

export function player(name) {
	const board = gameBoard();

	return { board };
}
