import { gameBoard } from './gameboard.js';

export function player(name) {
	const board = gameBoard();
	const playerName = name;

	return { board, playerName };
}
