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

## Installation

### Windows

1.  **Install Node.js:** Download and install Node.js from [https://nodejs.org/](https://nodejs.org/).
2.  **Clone the repository:**

    ```bash
    git clone https://github.com/darkosBE/WAC-PROJECT
    ```

3.  **Install dependencies:**

    ```bash
    npm install
    ```

4.  **Build the project:**

    ```bash
    npm run build
    ```

5.  **Start the server:**

    ```bash
    npm start
    ```

6.  **Open the client:** Open your web browser and navigate to `http://localhost:8080`

### Linux

1.  **Install Node.js:**

    ```bash
    sudo apt-get update
    sudo apt-get install nodejs
    sudo apt-get install npm
    ```

2.  **Clone the repository:**

    ```bash
    git clone https://github.com/darkosbe/WAC-PROJECT
    ```

3.  **Install dependencies:**

    ```bash
    npm install
    ```

4.  **Build the project:**

    ```bash
    npm run build
    ```

5.  **Start the server:**

    ```bash
    npm start
    ```

6.  **Open the client:** Open your web browser and navigate to `http://localhost:8080`

### VPS

1.  **Connect to your VPS:** Connect to your VPS using SSH.
2.  **Install Node.js:**

    ```bash
    sudo apt-get update
    sudo apt-get install nodejs
    sudo apt-get install npm
    ```

3.  **Clone the repository:**

    ```bash
    git clone https://github.com/darkosbe/WAC-PROJECT
    ```

4.  **Install dependencies:**

    ```bash
    npm install
    ```

5.  **Build the project:**

    ```bash
    npm run build
    ```

6.  **Start the server with a process manager:**

    ```bash
    npm install -g pm2
    pm2 start npm --name "web-afk-client" -- start
    ```

7.  **Access the client:** You should be able to access the client through your VPS's IP address and the port `8080`

## Contributing

Contributions are welcome! If you have any ideas, suggestions, or bug reports, please open an issue or submit a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.
