# Web AFK Client

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Socket.io](https://img.shields.io/badge/Socket.io-black?style=for-the-badge&logo=socket.io&badgeColor=010101)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)

<br/>

**Web AFK Client** is a premium, web-based tool for managing Minecraft bot accounts. Designed with a sleek dark theme and modern UI, it offers powerful features for AFK farming, chat monitoring, and bot management—all from your browser.

---

## ✨ Features

- **Multi-Bot Management**: Connect unlimited bots simultaneously.
- **Live Chat Console**: Monitor server chat and send messages in real-time.
- **Movement Controls**: Move bots (WASD, Jump) directly from the web interface.
- **Anti-AFK**: Built-in logic to prevent being kicked for inactivity.
- **Auto-Reconnect**: Automatically reconnects bots if they get disconnected.
- **Proxy Support**: Route bots through SOCKS/HTTP proxies for security.
- **Account Manager**: Save and manage bot credentials easily.
- **Configurable Settings**: Toggle physics, sneaking, and custom join messages.

---

## 🚀 Installation & Setup

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
    *The backend will start on port `25582`.*

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

## 📝 Changelog

### version uhh i lost track - The "Modernazation" Update
- **UI Redesign**: Complete overhaul of the interface with a pure black aesthetic, vibrant accents, and a modern sidebar layout.
- **Proxy Logic**: Fully implemented the Proxies page. You can now add, save, and use proxies for your bots.
- **Movement Fixes**: Verified and optimized movement controls (WASD works!).
- **Bug Fixes**:
    - Fixed duplicate socket hooks causing connection issues.
    - Cleaned up unused imports and placeholder code.
    - Corrected typos in meta tags.

---

## 🤝 Contributing

Contributions are welcome! Feel free to open issues or submit pull requests to improve the client.

## 📄 License

This project is licensed under the BSD-3-Clause license.


<p align="center">
  ahh Yes.<b> I am finally back And updated the code after a few weeks.</b>

  Sorry if i was gone a bit too long
</p>

# PREVIEW

IMG BY SYZDARK
<img width="1915" height="958" alt="image" src="https://github.com/user-attachments/assets/f8d11a6e-9357-4151-932a-d2ba2fb32dd5" />


## Disclaimer

This project is a **fan-made** tool designed for technical Minecraft players. It is intended as an alternative option for users who want to host their own cloud-based account management with a web GUI, similar to applications like *AFK Console Client*. This project is not affiliated with Mojang Studios, Microsoft, or the developers of AFK Console Client.

## DEVELOPMENT BUILDS

- I have another repo for development builds and it may have alot of bugs. It may break
- the old code. Or may not work with the old code
- 

### DEVELOPMENT REPO

(CLICK ME FOR THE REPO)[https://github.com/darkosBE/WAC-DEVELOPMENT]

---

<p align="center">
  Made with ❤️ by <b>SyzDark</b>
</p>

---
