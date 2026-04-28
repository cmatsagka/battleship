import { player } from './player.js';

export function gameController() {
	const p1 = player('Human');
	const comp = player('Computer', 'computer');
	let activePlayer = p1;

	const getActivePlayer = () => activePlayer;

	const getEnemy = () => (activePlayer === p1 ? comp : p1);

	const switchTurn = () => {
		activePlayer = getEnemy();
	};

	const playRound = (x, y) => {
		const enemy = getEnemy();
		const result = activePlayer.attack(enemy.board, x, y);

		if (result !== 'already attacked') {
			switchTurn();
		}
		return result;
	};

	return {
		playRound,
		getEnemy,
		getActivePlayer,
		switchTurn,
		p1,
		comp,
	};
}
