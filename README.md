# battleship

A professional boilerplate for modern Vanilla JavaScript projects using Webpack.

---

## 🚀 How to use this template

Follow these steps every time you start a new project to ensure your repository metadata is clean and professional.

### 1. GitHub Setup

- Click the green **"Use this template"** button above and select **"Create a new repository"**.
- Clone your new repository to your local machine:
    ```bash
    git clone [https://github.com/cmatsagka/YOUR-REPO-NAME.git](https://github.com/cmatsagka/YOUR-REPO-NAME.git)
    ```
- Open the folder in VS Code.

### 2. Update Metadata

Open `package.json` and replace all instances of `vanilla-js-template` with your **new project name**:

- `"name": "your-project-name"`
- `"url": "git+https://github.com/cmatsagka/your-project-name.git"`
- `"homepage": "https://cmatsagka.github.io/your-project-name/#readme"`

### 3. Sync & Secure

Run these commands in your terminal to sync the lockfile and patch dependencies:

```bash
# Sync package-lock.json with the new name
npm install

# Fix any security vulnerabilities
npm audit fix
```

### 4. Initial Push & Deploy

Commit your changes and launch your live site:

```bash
git add .
git commit -m "chore: initial project setup and rename"
git push origin main

# Deploy to GitHub Pages

npm run deploy
```

---

### 🧪 Testing

This template comes pre-configured with **Jest**.

- To run tests once: `npm test`
- To keep tests running while you code: `npm run test:watch`

Tests should be placed in the `src/` folder with the naming convention `filename.test.js`.

---

### 5. Final Polish

- Go to your GitHub repo Settings > Pages and ensure the branch is set to gh-pages.

- In the About section on the main page, click the ⚙️ icon and check "Use your GitHub Pages website".
