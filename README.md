# Web AFK Client

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Socket.io](https://img.shields.io/badge/Socket.io-black?style=for-the-badge&logo=socket.io&badgeColor=010101)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)

This project is a web-based client for managing AFK bots on a Minecraft server. It provides a user-friendly interface to connect, control, and monitor multiple bots simultaneously.

## Features

*   **Multi-bot management:** Connect and control multiple bots from a single interface.
*   **Real-time chat:** Monitor the in-game chat and send messages through your bots.
*   **Spam control:** Configure and toggle spam messages with customizable delays.
*   **Live dashboard:** View the status and information of your bots in real-time.
*   **Proxy support:** Connect your bots through proxies for enhanced privacy and security.

---

## Installation Guide

This guide provides instructions for setting up both the **Backend** and **Frontend** services on different operating systems.

### Prerequisites

*   **Node.js:** Make sure you have Node.js installed. You can download it from [https://nodejs.org/](https://nodejs.org/).
*   **Git:** You will need Git to clone the repository. You can download it from [https://git-scm.com/](https://git-scm.com/).

### 1. Project Setup

First, clone the repository to your local machine or VPS:

```bash
git clone https://github.com/darkosbe/WAC-PROJECT
cd WAC-PROJECT
```

The project is divided into two main parts:
- **`backend`**: The Node.js server that manages the Minecraft bots.
- **`frontend-server`**: The React-based web interface for controlling the bots.

You will need to install and run both.

---

### 2. Backend Installation

The backend service runs on port **1043**.

#### Windows & Linux

1.  **Navigate to the backend directory:**
    ```bash
    cd docs/backend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Start the backend server:**
    ```bash
    # This will start the server and log "AFK Console Backend running on http://localhost:1043"
    npm start
    ```

#### VPS (with PM2)

For a VPS, it's recommended to use a process manager like `pm2` to keep the server running in the background.

1.  **Navigate to the backend directory:**
    ```bash
    cd docs/backend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Install PM2 globally:**
    ```bash
    npm install -g pm2
    ```

4.  **Start the server with PM2:**
    ```bash
    pm2 start npm --name "afk-backend" -- start
    ```

---

### 3. Frontend Installation

The frontend service runs on port **8080**.

**Important:** Make sure you are in the root directory of the project (`WAC-PROJECT`) before starting.

#### Windows & Linux

1.  **Install dependencies:**
    ```bash
    npm install
    ```

2.  **Build the project:**
    ```bash
    npm run build
    ```

3.  **Start the frontend server:**
    ```bash
    # This will serve the built React application
    npm start
    ```

#### VPS (with PM2)

1.  **Install dependencies & Build:**
    ```bash
    npm install
    npm run build
    ```

2.  **Install PM2 globally (if not already installed):**
    ```bash
    npm install -g pm2
    ```

3.  **Start the server with PM2:**
    ```bash
    pm2 start npm --name "afk-frontend" -- start
    ```

---

### 4. Accessing the Application

Once both the backend and frontend are running, you can access the web client by navigating to:

-   **Locally:** `http://localhost:8080`
-   **On a VPS:** `http://<your-vps-ip>:8080`

Make sure that port `8080` (for the frontend) and `1043` (for the backend) are open on your server's firewall.

## Contributing

Contributions are welcome! If you have any ideas, suggestions, or bug reports, please open an issue or submit a pull request.

## License

This project is licensed under the MIT License.
