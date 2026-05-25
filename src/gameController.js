import { player } from './player.js';

export function gameController() {
	const p1 = player('Human');
	const comp = player('Computer', 'computer');
	let activePlayer = p1;
	let gameOver = false;

	const placeComputerShips = () => {
		comp.board.ships.forEach((ship) => {
			let placed = false;

			while (!placed) {
				const x = Math.floor(Math.random() * 10);
				const y = Math.floor(Math.random() * 10);
				const orientation =
					Math.random() > 0.5 ? 'horizontal' : 'vertical';

				if (comp.board.placeShip(ship, x, y, orientation)) {
					placed = true;
				}
			}
		});
		return true;
	};

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

		const result = p1.attack(comp.board, x, y);
		if (result === 'You already attacked here!') return result;
		if (checkWin()) return 'Human Wins!';

		return { humanResult: result };
	};

	const playComputerTurn = () => {
		if (gameOver) return 'Game is already over!';
		const compResult = comp.randomAttack(p1.board);
		if (checkWin()) return 'Computer Wins!';
		return { compResult: compResult };
	};

	return {
		playRound,
		playComputerTurn,
		getEnemy,
		getActivePlayer,
		switchTurn,
		p1,
		comp,
		isGameOver: () => gameOver,
		placeComputerShips,
	};
}
