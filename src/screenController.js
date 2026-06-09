import { gameBoard } from './gameBoard.js';
import { gameController } from './gameController.js';
import { player } from './player.js';
import { ship } from './ship.js';

export function screenController() {
	const p1BoardDOM = document.querySelector('#human-board');
	const compBoardDOM = document.querySelector('#comp-board');
	const humanMessage = document.querySelector('#human-message');
	const compMessage = document.querySelector('#comp-message');
	const restartBtn = document.querySelector('#restart-btn');
	const randomP1Btn = document.querySelector('#random-p1-btn');
	const rotateBtn = document.querySelector('#rotate-btn');
	const rotateText = document.querySelector('#rotate-text');
	const startMatchBtn = document.querySelector('#start-match-btn');
	const shipDockDOM = document.querySelector('#ship-dock');
	const dockTitle = document.querySelector('#dock-status-title');

	let game;
	let isComputerThinking;
	let isGameStarted;
	let currentOrientation = 'horizontal';
	let draggedShipElement = null;
	let pickedUpShipName = null;

	const randomizePlayerShips = (playerObject, boardDOM, isHidden) => {
		playerObject.board.resetBoard();

		playerObject.board.ships.forEach((ship) => {
			let placed = false;

			while (!placed) {
				const x = Math.floor(Math.random() * 10);
				const y = Math.floor(Math.random() * 10);
				const orientation =
					Math.random() > 0.5 ? 'horizontal' : 'vertical';

				if (playerObject.board.placeShip(ship, x, y, orientation)) {
					placed = true;
				}
			}
		});

		createBoard(playerObject.board, boardDOM, isHidden);
	};

	const updateOrientationUI = () => {
		if (rotateText) {
			rotateText.textContent =
				currentOrientation.charAt(0).toUpperCase() +
				currentOrientation.slice(1);
		}
		rotateBtn.setAttribute('data-orientation', currentOrientation);
		rotateBtn.classList.toggle(
			'is-vertical',
			currentOrientation === 'vertical'
		);
	};

	const renderShipDock = () => {
		shipDockDOM.textContent = '';
		let unplacedCount = 0;

		game.p1.board.ships.forEach((ship) => {
			let isShipPlacedOnBoard = false;

			for (let y = 0; y < 10; y++) {
				for (let x = 0; x < 10; x++) {
					const currentSquare = game.p1.board.getSquare(x, y);

					if (currentSquare && currentSquare.name === ship.name) {
						isShipPlacedOnBoard = true;
						break;
					}
				}
				if (isShipPlacedOnBoard) break;
			}

			if (isShipPlacedOnBoard) return;

			unplacedCount++;

			const shipContainer = document.createElement('div');
			shipContainer.classList.add('dock-ship');
			shipContainer.setAttribute('draggable', 'true');
			shipContainer.dataset.name = ship.name;
			shipContainer.dataset.length = ship.length;

			for (let i = 0; i < ship.length; i++) {
				const segment = document.createElement('div');
				segment.classList.add('ship-segment');
				shipContainer.appendChild(segment);
			}

			shipDockDOM.appendChild(shipContainer);

			shipContainer.addEventListener('dblclick', () => {
				rotateBtn.click();
				humanMessage.textContent = `Dock placement orientation changed to ${currentOrientation}!`;
			});
		});

		if (dockTitle) {
			if (unplacedCount > 0) {
				dockTitle.textContent = `In dock: ${unplacedCount}`;
			} else {
				dockTitle.textContent = 'Fleet Mobilized';
			}
		}
	};

	const getOccupiedSquares = (startX, startY, length, orientation) => {
		const squares = [];
		for (let i = 0; i < length; i++) {
			const targetX = orientation === 'horizontal' ? startX + i : startX;
			const targetY = orientation === 'vertical' ? startY + i : startY;
			squares.push({ x: targetX, y: targetY });
		}
		return squares;
	};

	const clearHoverEffects = () => {
		const allSquares = p1BoardDOM.querySelectorAll('.square');
		allSquares.forEach((sq) => {
			sq.classList.remove('hover-valid', 'hover-invalid');
		});
	};

	const handleDockDragStart = (e) => {
		if (isGameStarted) {
			e.preventDefault();
			return;
		}
		const shipEl = e.currentTarget;
		draggedShipElement = shipEl;
		pickedUpShipName = null;
		e.dataTransfer.setData('text/plain', shipEl.dataset.name);
	};

	const handleBoardDragStart = (e) => {
		if (isGameStarted) return e.preventDefault();

		const shipSquare = e.currentTarget;
		const shipName = shipSquare.dataset.shipName;
		pickedUpShipName = shipName;

		const shipObject = game.p1.board.ships.find((s) => s.name === shipName);

		let headX = null;
		let headY = null;
		let originalOrientation = 'horizontal';

		for (let y = 0; y < 10; y++) {
			for (let x = 0; x < 10; x++) {
				const cell = game.p1.board.getSquare(x, y);
				if (cell && cell.name === shipName) {
					if (headX === null && headY === null) {
						headX = x;
						headY = y;
					} else if (x === headX && y > headY) {
						originalOrientation = 'vertical';
					}
				}
			}
		}

		draggedShipElement = {
			dataset: {
				name: shipName,
				length: shipObject.length,
				origX: headX,
				origY: headY,
				origOrient: originalOrientation,
			},
		};

		const matchingSquares = p1BoardDOM.querySelectorAll(
			`[data-ship-name="${shipName}"]`
		);
		matchingSquares.forEach((sq) => sq.classList.add('dragging'));
	};

	const handleBoardDragEnd = () => {
		if (isGameStarted) return;

		if (pickedUpShipName !== null) {
			const name = draggedShipElement.dataset.name;
			game.p1.board.removeShipFromDataMatrix(name);
			humanMessage.textContent = `${name} returned to the dock.`;

			draggedShipElement = null;
			pickedUpShipName = null;
			createBoard(game.p1.board, p1BoardDOM, false);
			renderShipDock();
			setupDragAndBoard();
			startMatchBtn.classList.add('hidden');
			randomP1Btn.classList.remove('hidden');
		}
	};

	const handleBoardDoubleClick = (e) => {
		if (isGameStarted) return;

		const shipSquare = e.currentTarget;
		const shipName = shipSquare.dataset.shipName;
		const shipObject = game.p1.board.ships.find((s) => s.name === shipName);

		if (!shipObject) return;

		let headX = null;
		let headY = null;
		let shipActualOrient = 'horizontal';

		for (let y = 0; y < 10; y++) {
			for (let x = 0; x < 10; x++) {
				const cell = game.p1.board.getSquare(x, y);
				if (cell && cell.name === shipName) {
					if (headX === null && headY === null) {
						headX = x;
						headY = y;
					} else if (x === headX && y > headY) {
						shipActualOrient = 'vertical';
					}
				}
			}
		}
		const flippedOrient =
			shipActualOrient === 'horizontal' ? 'vertical' : 'horizontal';

		game.p1.board.removeShipFromDataMatrix(shipName);

		const canRotate = game.p1.board.isValidPlacement(
			shipObject,
			headX,
			headY,
			flippedOrient
		);

		if (canRotate) {
			game.p1.board.placeShip(shipObject, headX, headY, flippedOrient);
			humanMessage.textContent = `${shipObject.name} rotated successfully!`;
		} else {
			game.p1.board.placeShip(shipObject, headX, headY, shipActualOrient);
			humanMessage.textContent = `Cannot rotate ${shipObject.name} here! Blocked or out of bounds.`;
		}

		createBoard(game.p1.board, p1BoardDOM, false);
		renderShipDock();
		setupDragAndBoard();
	};

	const handleDragEnter = (e) => {
		if (!draggedShipElement || isGameStarted) return;
		if (!e.target.classList.contains('square')) return;

		clearHoverEffects();

		const startX = parseInt(e.target.dataset.x);
		const startY = parseInt(e.target.dataset.y);
		const length = parseInt(draggedShipElement.dataset.length);
		const name = draggedShipElement.dataset.name;

		const shipObject = game.p1.board.ships.find((s) => s.name === name);

		const orientationToUse = draggedShipElement.dataset.origOrient
			? draggedShipElement.dataset.origOrient
			: currentOrientation;
		const isValid = game.p1.board.isValidPlacement(
			shipObject,
			startX,
			startY,
			orientationToUse
		);

		const coordinates = getOccupiedSquares(
			startX,
			startY,
			length,
			orientationToUse
		);

		coordinates.forEach((coord) => {
			const targetSquare = p1BoardDOM.querySelector(
				`[data-x="${coord.x}"][data-y="${coord.y}"]`
			);
			if (targetSquare) {
				targetSquare.classList.add(
					isValid ? 'hover-valid' : 'hover-invalid'
				);
			}
		});
	};

	const handleBoardDrop = (e) => {
		if (!draggedShipElement || isGameStarted) return;
		e.preventDefault();
		clearHoverEffects();

		const target = e.target.closest('.square');
		if (!target) return;

		const startX = parseInt(target.dataset.x);
		const startY = parseInt(target.dataset.y);
		const name = draggedShipElement.dataset.name;

		const shipObject = game.p1.board.ships.find((s) => s.name === name);

		const orientationToUse = draggedShipElement.dataset.origOrient
			? draggedShipElement.dataset.origOrient
			: currentOrientation;

		if (pickedUpShipName !== null) {
			game.p1.board.removeShipFromDataMatrix(name);
		}

		const placementSuccessful = game.p1.board.placeShip(
			shipObject,
			startX,
			startY,
			orientationToUse
		);

		if (placementSuccessful) {
			if (
				pickedUpShipName === null &&
				typeof draggedShipElement.remove === 'function'
			) {
				draggedShipElement.remove();
			}
			createBoard(game.p1.board, p1BoardDOM, false);

			renderShipDock();

			if (shipDockDOM.children.length === 0) {
				startMatchBtn.classList.remove('hidden');
				randomP1Btn.classList.add('hidden');
				humanMessage.textContent =
					'All ships deployed! Click Commit Fleet to start your battle!';
			}
		} else {
			if (pickedUpShipName !== null) {
				const origX = parseInt(draggedShipElement.dataset.origX);
				const origY = parseInt(draggedShipElement.dataset.origY);
				const origOrient = draggedShipElement.dataset.origOrient;

				game.p1.board.placeShip(shipObject, origX, origY, origOrient);
				humanMessage.textContent =
					'Invalid placement! Ship returned to its original position.';
			}
			createBoard(game.p1.board, p1BoardDOM, false);
			renderShipDock();
		}
		draggedShipElement = null;
		pickedUpShipName = null;
		setupDragAndBoard();
	};

	const setupDragAndBoard = () => {
		const dockShips = document.querySelectorAll('.dock-ship');
		dockShips.forEach((shipEl) => {
			shipEl.addEventListener('dragstart', handleDockDragStart);
		});

		const boardShips = p1BoardDOM.querySelectorAll('.square.ship');
		boardShips.forEach((shipSquare) => {
			shipSquare.addEventListener('dragstart', handleBoardDragStart);

			shipSquare.addEventListener('dragend', handleBoardDragEnd);

			shipSquare.addEventListener('dblclick', handleBoardDoubleClick);
		});

		p1BoardDOM.addEventListener('dragover', (e) => {
			e.preventDefault();
		});

		p1BoardDOM.addEventListener('dragenter', handleDragEnter);

		p1BoardDOM.addEventListener('dragleave', (e) => {
			if (e.relatedTarget && !p1BoardDOM.contains(e.relatedTarget)) {
				clearHoverEffects();
			}
		});

		p1BoardDOM.addEventListener('drop', handleBoardDrop);
	};

	const createBoard = (gameBoard, parentElement, isHidden) => {
		parentElement.textContent = '';

		for (let y = 0; y < 10; y++) {
			for (let x = 0; x < 10; x++) {
				const square = document.createElement('div');
				square.dataset.x = x;
				square.dataset.y = y;
				square.classList.add('square');

				const targetState = gameBoard.getSquare(x, y);

				if (targetState === 'miss') {
					square.classList.add('miss');
				} else if (targetState === 'hit') {
					square.classList.add('hit');
				} else if (targetState !== null && !isHidden) {
					square.classList.add('ship');
					square.dataset.shipName = targetState.name;
					if (!isHidden) {
						square.setAttribute('draggable', 'true');
						square.dataset.shipName = targetState.name;
					}
				} else {
					square.classList.add('sea');
				}

				parentElement.appendChild(square);
			}
		}
	};

	const handleOrientationChange = (mql) => {
		if (mql.matches) {
			humanMessage.textContent =
				'Rotate your device for a better view of the battlefield!';
		}
	};

	const mql = window.matchMedia(
		'(max-width: 600px) and (orientation: portrait)'
	);
	mql.addEventListener('change', handleOrientationChange);

	const startNewGame = () => {
		game = gameController();
		isGameStarted = false;
		isComputerThinking = false;
		currentOrientation = 'horizontal';
		updateOrientationUI();

		humanMessage.textContent =
			'Deploy your fleet! Drag ships to your board or click to Randomize.';
		compMessage.textContent = '';
		restartBtn.classList.add('hidden');
		restartBtn.classList.remove('pop-attention');

		randomP1Btn.classList.remove('hidden');
		startMatchBtn.classList.add('hidden');

		game.placeComputerShips();
		renderShipDock();

		createBoard(game.p1.board, p1BoardDOM, false);
		createBoard(game.comp.board, compBoardDOM, true);

		setupDragAndBoard();
	};

	compBoardDOM.addEventListener('click', (e) => {
		if (!isGameStarted) return;
		if (!e.target.classList.contains('square')) return;
		if (game.isGameOver() || isComputerThinking) return;

		const x = parseInt(e.target.dataset.x);
		const y = parseInt(e.target.dataset.y);

		const roundResult = game.playRound(x, y);

		if (typeof roundResult === 'string') {
			humanMessage.textContent = roundResult;
			if (game.isGameOver()) {
				restartBtn.classList.remove('hidden');
				restartBtn.classList.add('pop-attention');
			}
			return;
		}

		const humanHit = roundResult.humanResult;

		if (humanHit.sunk) {
			humanMessage.textContent = `BOOM! You sank the computer's ${humanHit.shipName}!`;
		} else {
			humanMessage.textContent = humanHit.hit
				? `You hit their ${humanHit.shipName}!`
				: 'You missed!';
		}

		compMessage.textContent = 'Computer is planning...';

		createBoard(game.p1.board, p1BoardDOM, false);
		createBoard(game.comp.board, compBoardDOM, true);

		if (game.isGameOver()) {
			humanMessage.textContent = 'Human Wins!';
			compMessage.textContent = '';
			restartBtn.classList.remove('hidden');
			restartBtn.classList.add('pop-attention');
			return;
		}

		isComputerThinking = true;

		setTimeout(() => {
			const compRoundResult = game.playComputerTurn();

			if (typeof compRoundResult === 'string') {
				compMessage.textContent = compRoundResult;
			} else {
				const compHit = compRoundResult.compResult;

				if (compHit.sunk) {
					compMessage.textContent = `MAYDAY! Computer sank your ${compHit.shipName}!`;
				} else {
					compMessage.textContent = compHit.hit
						? `Computer hit your ${compHit.shipName}!`
						: 'Computer missed.';
				}
			}

			createBoard(game.p1.board, p1BoardDOM, false);
			createBoard(game.comp.board, compBoardDOM, true);

			if (game.isGameOver()) {
				humanMessage.textContent =
					'Computer Wins! Your fleet was destroyed.';
				compMessage.textContent = '';
				restartBtn.classList.remove('hidden');
				setTimeout(() => {
					restartBtn.classList.add('pop-attention');
				}, 10);
				isComputerThinking = false;
				return;
			}
			isComputerThinking = false;
		}, 1000);
	});

	randomP1Btn.addEventListener('click', () => {
		randomizePlayerShips(game.p1, p1BoardDOM, false);
		renderShipDock();
		startMatchBtn.classList.remove('hidden');
		setupDragAndBoard();
	});

	restartBtn.addEventListener('click', () => {
		startNewGame();
	});

	rotateBtn.addEventListener('click', () => {
		currentOrientation =
			currentOrientation === 'horizontal' ? 'vertical' : 'horizontal';

		updateOrientationUI();
	});

	startMatchBtn.addEventListener('click', () => {
		randomP1Btn.classList.add('hidden');
		startMatchBtn.classList.add('hidden');
		isGameStarted = true;

		if (dockTitle) {
			dockTitle.textContent = 'Fleet sailing';
		}
		humanMessage.textContent = 'Fleet deployed! Your turn to attack!';
	});

	shipDockDOM.addEventListener('dragover', (e) => {
		if (!isGameStarted && pickedUpShipName !== null) {
			e.preventDefault();
		}
	});

	startNewGame();
}
