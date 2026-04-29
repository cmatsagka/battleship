import { player } from './player.js';

export function gameController() {
	const p1 = player('Human');
	const comp = player('Computer', 'computer');
	let activePlayer = p1;
	let gameOver = false;

	const getActivePlayer = () => activePlayer;

	const getEnemy = () => (activePlayer === p1 ? comp : p1);

	const switchTurn = () => {
		activePlayer = getEnemy();
	};

	const checkWin = () => {
		if (p1.board.allSunk() || comp.board.allSunk()) {
			gameOver = true;
			return true;
		}
		return false;
	};

	const playRound = (x, y) => {
		if (gameOver) return 'Game is already over!';
		const enemy = comp;

		const result = p1.attack(enemy.board, x, y);
		if (result === 'already attacked') return result;
		if (checkWin()) return 'Human Wins!';

		const compResult = comp.randomAttack(p1.board);
		if (checkWin()) return 'Computer Wins!';

		return { humanResult: result, compResult: compResult };
	};

	return {
		playRound,
		getEnemy,
		getActivePlayer,
		switchTurn,
		p1,
		comp,
		isGameOver: () => gameOver,
	};
}
