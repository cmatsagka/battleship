import { player } from './player.js';

export function gameController() {
	const p1 = player('Human');
	const comp = player('Computer', 'computer');
	let activePlayer = p1;
	let gameOver = false;
	let aiState = {
		mode: 'HUNT',
		anchor: null,
		targetQueue: [],
		streakQueue: [],
	};

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

		if (aiState.mode === 'STREAK' && aiState.streakQueue.length > 0) {
			[x, y] = aiState.streakQueue.shift();
		} else if (
			aiState.mode === 'TARGET' &&
			aiState.targetQueue.length > 0
		) {
			[x, y] = aiState.targetQueue.pop();
		} else {
			aiState.mode = 'HUNT';
			const attackData = comp.randomAttack(p1.board);
			x = attackData.x;
			y = attackData.y;
			compResult = attackData.result;
		}

		if (aiState.mode !== 'HUNT' && x !== undefined && y !== undefined) {
			compResult = comp.attack(p1.board, x, y);
		}

		if (compResult.sunk === true) {
			if (aiState.targetQueue.length > 0) {
				aiState.mode = 'TARGET';
				aiState.streakQueue = [];
			} else {
				aiState = {
					mode: 'HUNT',
					anchor: null,
					targetQueue: [],
					streakQueue: [],
				};
			}
		} else if (compResult.hit === true) {
			if (aiState.mode === 'HUNT') {
				aiState.mode = 'TARGET';
				aiState.anchor = [x, y];

				const potentialTargets = [
					[x + 1, y],
					[x - 1, y],
					[x, y + 1],
					[x, y - 1],
				];

				potentialTargets.forEach(([nx, ny]) => {
					if (nx >= 0 && nx < 10 && ny >= 0 && ny < 10) {
						const targetState = p1.board.getSquare(nx, ny);

						if (targetState !== 'hit' && targetState !== 'miss') {
							aiState.targetQueue.push([nx, ny]);
						}
					}
				});
			} else if (aiState.mode === 'TARGET') {
				aiState.mode = 'STREAK';
				aiState.targetQueue = [];

				const dx = x - aiState.anchor[0];
				const dy = y - aiState.anchor[1];

				let fx = x + dx;
				let fy = y + dy;

				while (
					fx >= 0 &&
					fx < 10 &&
					fy >= 0 &&
					fy < 10 &&
					p1.board.getSquare(fx, fy) !== 'miss'
				) {
					if (p1.board.getSquare(fx, fy) !== 'hit') {
						aiState.streakQueue.push([fx, fy]);
					}
					fx += dx;
					fy += dy;
				}

				let bx = aiState.anchor[0] - dx;
				let by = aiState.anchor[1] - dy;

				while (
					bx >= 0 &&
					bx < 10 &&
					by >= 0 &&
					by < 10 &&
					p1.board.getSquare(bx, by) !== 'miss'
				) {
					if (p1.board.getSquare(bx, by) !== 'hit') {
						aiState.streakQueue.push([bx, by]);
					}
					bx -= dx;
					by -= dy;
				}
			}
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
