import { player } from './player.js';

export function gameController(move) {
	const p1 = player('Human');
	const comp = player('Computer', 'computer');
	let activePlayer = p1;

	const getActivePlayer = () => activePlayer;

	const switchTurn = () => {
		if (activePlayer === comp) {
			activePlayer = p1;
		} else {
			activePlayer = comp;
		}
	};
	return { getActivePlayer, switchTurn, p1, comp };
}
