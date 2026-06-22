# Battleship

A modern, responsive, and test-driven implementation of the classic Battleship board game built entirely with vanilla JavaScript, HTML5, and CSS3. The game features interactive drag-and-drop mechanics, real-time board mutations, custom AI targeting behaviors, and a complete Jest unit-testing suite.

---

## 🚀 Live Demo

🌐 [View Live Application](https://cmatsagka.github.io/battleship/)

---

## ✨ Features

- **Interactive Grid Placement:** Smooth drag-and-drop system using high-performance DOM event delegation for placing, moving, and returning ships to dock.
- **Persistent Controls:** A dedicated `New Game` state system accessible throughout all stages of gameplay to reset matrices and fleets smoothly.
- **Adaptive Computer AI:** Custom hunt-and-target tracking routine preventing duplicate attacks while accurately uncovering hidden enemy grids.
- **State Animation Rules:** Immersive CSS keyframe animations and glowing visual feedback that trigger uniquely during terminal match conclusions.
- **Robust Boundary Protection:** Dynamic grid evaluation systems protecting rows and columns against collision mapping or dimension shifting errors.

---

## 🛠️ Tech Stack & Architecture

- **Frontend Vanilla Core:** Semantic HTML5, CSS3 Variables & Flexbox, JavaScript (ES6+ Module Pattern)
- **Testing Infrastructure:** Jest Test Runner (Unit & Integration validation)
- **Code Design Pattern:** Factory Functions for clean separation of concerns (`ship`, `player`, `gameBoard`, `gameController`)

---

## 🧪 Testing Suite

The engine is built following Test-Driven Development (TDD) philosophies, ensuring high stability across all core system algorithms.

```bash
# Run the complete automated Jest test suite
npm test
```

## 📦 Installation & Setup

1. **Clone the repository:**

    ```bash
    git clone git@github.com:cmatsagka/battleship.git
    ```

2. **Install development dependencies:**

    ```bash
    npm install
    ```

3. **Launch the application:**
    ```bash
    npm start
    ```
