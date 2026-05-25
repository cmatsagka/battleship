import { player } from './player.js';

export function gameController() {
	const p1 = player('Human');
	const comp = player('Computer', 'computer');
	let activePlayer = p1;
	let gameOver = false;
	let nextMove;
	let adjacentSlots = [];

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

		let compResult;
		let x, y;

		if (adjacentSlots.length > 0) {
			const cords = adjacentSlots.pop();
			x = cords[0];
			y = cords[1];
			compResult = comp.attack(p1.board, x, y);
		} else {
			const attackData = comp.randomAttack(p1.board);
			x = attackData.x;
			y = attackData.y;
			compResult = attackData.result;
		}

		if (compResult.hit === true && compResult.sunk === false) {
			if (x + 1 < 10) adjacentSlots.push([x + 1, y]);

			if (x - 1 >= 0) adjacentSlots.push([x - 1, y]);

			if (y + 1 < 10) adjacentSlots.push([x, y + 1]);

			if (y - 1 >= 0) adjacentSlots.push([x, y - 1]);
		}

		if (compResult.sunk === true) {
			adjacentSlots = [];
		}

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
