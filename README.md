# Web AFK Client

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Socket.io](https://img.shields.io/badge/Socket.io-black?style=for-the-badge&logo=socket.io&badgeColor=010101)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)

<br/>

**Web AFK Client** is a premium, web-based tool for managing Minecraft bot accounts. Designed with a sleek dark theme and modern UI, it offers powerful features for AFK farming, chat monitoring, and bot management—all from your browser.

---

## Features

- **Multi-Bot Management**: Connect unlimited bots simultaneously.
- **Live Chat Console**: Monitor server chat and send messages in real-time.
- **Movement Controls**: Move bots (WASD, Jump) directly from the web interface.
- **Anti-AFK**: Built-in logic to prevent being kicked for inactivity.
- **Auto-Reconnect**: Automatically reconnects bots if they get disconnected.
- **Proxy Support**: Route bots through SOCKS/HTTP proxies for security.
- **Account Manager**: Save and manage bot credentials easily.
- **Configurable Settings**: Toggle physics, sneaking, and custom join messages.

---

## Installation & Setup

You need to run both the **Backend** (bot manager) and **Frontend** (web interface) for the application to work.

### Prerequisites
- [Node.js](https://nodejs.org/) (v16 or higher)
- [Git](https://git-scm.com/)

### 1. Backend Setup (Port 25582)

The backend handles the Minecraft bot connections.

1.  Navigate to the `backend` folder:
    ```bash
    cd backend
    ```
2.  Install dependencies:
    ```bash
    npm install
    # Optional: Install pathfinder for smart movement
    # npm install mineflayer-pathfinder
    ```
3.  Start the server:
    ```bash
    npm start
    ```
    *The backend will start on port 25582.*

### 2. Frontend Setup (Port 8080)

The frontend provides the user interface.

1.  Navigate to the project root (where this README is):
    ```bash
    cd ..
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the development server:
    ```bash
    npm run dev
    ```
    *Access the client at http://localhost:8080*

---

## Changelog

### v26.1.1 — The "Frontend Polishment" Update
- **Full State Persistence**: Bot statuses, health, experience, and inventories now persist reliably across page refreshes.
- **Bot Status Persistence**: Dashboard page is now here where you can see health, experience, hunger bar and inventory of your bots.
- **Chat History Persistence**: Chat messages are now saved in local storage, so they remain visible after a reload.
- **Enhanced Disconnection**:
    - Added a functional Leave button to Dashboard cards.
    - Fixed the Power button on the Connect page to handle all active bot states (spawned, connecting).
    - Improved Disconnect All robustness to ensure all bots leave consistently.
- **Real-time Sync**: Implemented an explicit state sync mechanism between backend and frontend.
- **Bug Fixes**:
    - Fixed historic chat messages incorrectly displaying Server as the username.
    - Added granular backend logging for better event tracing.
    - Fixed a React hook violation in the Dashboard component.

---

## Contributing

Contributions are welcome! Feel free to open issues or submit pull requests to improve the client. Check out the [Contributing Guide](CONTRIBUTING.md) for more details.

## License

This project is licensed under the BSD-3-Clause license.

<p align="center">
  <b>I am finally back and updated the code after a few weeks.</b>
  <br/>
  Sorry if I was gone a bit too long.
</p>

# PREVIEW

IMG BY SYZDARK
<img width="1915" height="958" alt="image" src="https://github.com/user-attachments/assets/f8d11a6e-9357-4151-932a-d2ba2fb32dd5" />

## Disclaimer

This project is a **fan-made** tool designed for technical Minecraft players. It is intended as an alternative option for users who want to host their own cloud-based account management with a web GUI, similar to applications like *AFK Console Client*. This project is not affiliated with Mojang Studios, Microsoft, or the developers of AFK Console Client.

## DEVELOPMENT BUILDS

- I have another repo for development builds and it may have a lot of bugs. It may break old code.
- TOTAL DEVELOPMENT BUILDS
- COUNTER: [1]
- Check out the [Development Build Guide](DEVELOPMENT_BUILD.MD) for technical breakdowns.

### DEVELOPMENT REPO

[CLICK ME FOR THE REPO](https://github.com/darkosBE/WAC-DEVELOPMENT)

---

<p align="center">
  Made with passion by <b>SyzDark</b>
</p>
