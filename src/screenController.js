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

	const locateShipOnBoard = (shipName) => {
		let headX = null;
		let headY = null;
		let orientation = 'horizontal';

		for (let y = 0; y < 10; y++) {
			for (let x = 0; x < 10; x++) {
				const cell = game.p1.board.getSquare(x, y);
				if (cell && cell.name === shipName) {
					if (headX === null && headY === null) {
						headX = x;
						headY = y;
					} else if (x === headX && y > headY) {
						orientation = 'vertical';
					}
				}
			}
		}
		return headX !== null ? { headX, headY, orientation } : null;
	};

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

	const renderShipDock = () => {
		shipDockDOM.textContent = '';
		let unplacedCount = 0;

		game.p1.board.ships.forEach((ship) => {
			const isShipPlacedOnBoard = locateShipOnBoard(ship.name);

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
			shipContainer.addEventListener('dblclick', handleDockDoubleClick);
		});

		if (dockTitle) {
			if (unplacedCount > 0) {
				dockTitle.textContent = `In dock: ${unplacedCount}`;
			} else {
				dockTitle.textContent = 'Fleet Mobilized';
			}
		}
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
					square.setAttribute('draggable', 'true');
				} else {
					square.classList.add('sea');
				}

				parentElement.appendChild(square);
			}
		}
	};

	const handleDockDoubleClick = () => {
		if (isGameStarted) return;
		currentOrientation =
			currentOrientation === 'horizontal' ? 'vertical' : 'horizontal';
		updateOrientationUI();
		humanMessage.textContent = `Dock placement orientation changed to ${currentOrientation}!`;
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
		const shipLocation = locateShipOnBoard(shipName);
		if (!shipLocation) return;

		draggedShipElement = {
			dataset: {
				name: shipName,
				length: shipObject.length,
				origX: shipLocation.headX,
				origY: shipLocation.headY,
				origOrient: shipLocation.orientation,
			},
		};

		const matchingSquares = p1BoardDOM.querySelectorAll(
			`[data-ship-name="${shipName}"]`
		);
		matchingSquares.forEach((sq) => sq.classList.add('dragging'));
	};

	const handleBoardDragEnd = (e) => {
		if (isGameStarted) return;

		if (pickedUpShipName !== null) {
			const currentShip = e.currentTarget;
			const name =
				currentShip.dataset.shipName ||
				(draggedShipElement && draggedShipElement.dataset.name);

			if (name) {
				game.p1.board.removeShipFromDataMatrix(name);
				humanMessage.textContent = `${name} returned to the dock.`;
			}

			draggedShipElement = null;
			pickedUpShipName = null;
			createBoard(game.p1.board, p1BoardDOM, false);
			renderShipDock();
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

		const shipLocation = locateShipOnBoard(shipName);
		if (!shipLocation) return;

		const flippedOrient =
			shipLocation.orientation === 'horizontal'
				? 'vertical'
				: 'horizontal';

		game.p1.board.removeShipFromDataMatrix(shipName);

		const canRotate = game.p1.board.isValidPlacement(
			shipObject,
			shipLocation.headX,
			shipLocation.headY,
			flippedOrient
		);

		if (canRotate) {
			game.p1.board.placeShip(
				shipObject,
				shipLocation.headX,
				shipLocation.headY,
				flippedOrient
			);
			humanMessage.textContent = `${shipObject.name} rotated successfully!`;
		} else {
			game.p1.board.placeShip(
				shipObject,
				shipLocation.headX,
				shipLocation.headY,
				shipLocation.orientation
			);
			humanMessage.textContent = `Cannot rotate ${shipObject.name} here! Blocked or out of bounds.`;
		}

		createBoard(game.p1.board, p1BoardDOM, false);
		renderShipDock();
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
		const orientationToUse =
			draggedShipElement.dataset.origOrient || currentOrientation;
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
		const orientationToUse =
			draggedShipElement.dataset.origOrient || currentOrientation;

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
	};

	const initPersistentListeners = () => {
		p1BoardDOM.addEventListener('dragstart', (e) => {
			const shipSquare = e.target.closest('.square.ship');
			if (!shipSquare || isGameStarted) return;

			const shipName = shipSquare.dataset.shipName;
			pickedUpShipName = shipName;

			const shipObject = game.p1.board.ships.find(
				(s) => s.name === shipName
			);
			const shipLocation = locateShipOnBoard(shipName);
			if (!shipLocation) return;

			draggedShipElement = {
				dataset: {
					name: shipName,
					length: shipObject.length,
					origX: shipLocation.headX,
					origY: shipLocation.headY,
					origOrient: shipLocation.orientation,
				},
			};
		});

		p1BoardDOM.addEventListener('dragend', handleBoardDragEnd);

		p1BoardDOM.addEventListener('dblclick', (e) => {
			const shipSquare = e.target.closest('.square.ship');
			if (!shipSquare || isGameStarted) return;
			handleBoardDoubleClick(e);
		});

		p1BoardDOM.addEventListener('dragover', (e) => e.preventDefault());
		p1BoardDOM.addEventListener('dragenter', handleDragEnter);
		p1BoardDOM.addEventListener('dragleave', (e) => {
			if (e.relatedTarget && !p1BoardDOM.contains(e.relatedTarget)) {
				clearHoverEffects();
			}
		});
		p1BoardDOM.addEventListener('drop', handleBoardDrop);

		shipDockDOM.addEventListener('dragstart', (e) => {
			const shipEl = e.target.closest('.dock-ship');
			if (!shipEl || isGameStarted) return;

			draggedShipElement = shipEl;
			pickedUpShipName = null;
			e.dataTransfer.setData('text/plain', shipEl.dataset.name);
		});

		shipDockDOM.addEventListener('dragover', (e) => {
			if (!isGameStarted && pickedUpShipName !== null) e.preventDefault();
		});

		randomP1Btn.addEventListener('click', () => {
			randomizePlayerShips(game.p1, p1BoardDOM, false);
			renderShipDock();
			startMatchBtn.classList.remove('hidden');
		});

		restartBtn.addEventListener('click', startNewGame);

		rotateBtn.addEventListener('click', () => {
			currentOrientation =
				currentOrientation === 'horizontal' ? 'vertical' : 'horizontal';
			updateOrientationUI();
		});

		startMatchBtn.addEventListener('click', () => {
			randomP1Btn.classList.add('hidden');
			startMatchBtn.classList.add('hidden');
			restartBtn.classList.remove('hidden');

			isGameStarted = true;

			if (dockTitle) dockTitle.textContent = 'Fleet sailing';
			humanMessage.textContent = 'Fleet deployed! Your turn to attack!';
		});

		const mql = window.matchMedia(
			'(max-width: 600px) and (orientation: portrait)'
		);
		mql.addEventListener('change', (e) => {
			if (e.matches) {
				humanMessage.textContent =
					'Rotate your device for a better view of the battlefield!';
			}
		});
	};

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
				setTimeout(() => {
					restartBtn.classList.add('pop-attention');
				}, 10);
				isComputerThinking = false;
				return;
			}
			isComputerThinking = false;
		}, 1000);
	});

	initPersistentListeners();
	startNewGame();
}
