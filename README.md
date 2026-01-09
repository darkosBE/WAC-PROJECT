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

This guide provides instructions for setting up both the **Backend** and **Frontend** services. You must have both running for the application to work.

### Prerequisites

*   **Node.js:** Make sure you have Node.js installed. You can download it from [https://nodejs.org/](https://nodejs.org/).
*   **Git:** You will need Git to clone the repository. You can download it from [https://git-scm.com/](https://git-scm.com/).

### 1. Clone the Repository

First, clone the repository to your local machine or VPS:

```bash
git clone https://github.com/darkosBE/WAC-PROJECT
cd WAC-PROJECT
```

---

### 2. Backend Setup

The backend service runs the bot manager on port `1043`.

1.  **Navigate to the backend directory:**
    ```bash
    # From the root of the project (WAC-PROJECT)
    cd docs/backend
    ```

2.  **Install backend dependencies:**
    ```bash
    npm install
    ```

3.  **Start the backend server:**
    *   **For Windows/Linux (Development):**
        ```bash
        npm start
        ```
    *   **For a VPS (Production with PM2):**
        ```bash
        npm install -g pm2
        pm2 start npm --name "afk-backend" -- start
        ```

---

### 3. Frontend Setup

The frontend service runs the web interface on port `8080`.

1.  **Navigate to the frontend directory (root of the project):**
    ```bash
    # If you are in the backend directory, go back to the root
    cd ../../
    ```

2.  **Install frontend dependencies:**
    ```bash
    npm install
    ```

3.  **Build the frontend:**
    ```bash
    npm run build
    ```

4.  **Start the frontend server:**
    *   **For Windows/Linux (Development):**
        ```bash
        npm start
        ```
    *   **For a VPS (Production with PM2):**
        ```bash
        # PM2 should already be installed from the backend step
        pm2 start npm --name "afk-frontend" -- start
        ```

---

### 4. Accessing the Application

Once both the backend and frontend are running, you can access the web client by navigating to:

-   **Locally:** `http://localhost:8080`
-   **On a VPS:** `http://<your-vps-ip>:8080`

**Important:** Make sure that port `8080` (for the frontend) and `1043` (for the backend) are open on your server's or VPS's firewall.

## Contributing

Contributions are welcome! If you have any ideas, suggestions, or bug reports, please open an issue or submit a pull request.

## License

This project is licensed under the BSD-3-Clause license. See the [LICENSE](LICENSE) file for more details.
