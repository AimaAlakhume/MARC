# Crash Cart Robot Inventory Tracker Web Interface

This repository hosts the web-based interface for the Crash Cart Robot Inventory Tracker. The web interface provides real-time monitoring and management of
inventory data, allowing medical teams and administrators to efficiently track the status of supplies in the crash cart. 

The web interface connects with the hardware setup of the Crash Cart Inventory Tracking system, which utilizes a Raspberry Pi, Adafruit PIR Motion Sensors,
and LEDs. It displays data related to the current inventory status of each drawer section in the crash cart, alerting users when supplies need replenishment.
This system enhances the responsiveness and readiness of medical teams during critical situations.

## Setup Guide

This application consists of a React frontend and Node.js backend that need to be run simultaneously.

### Prerequisites

- Node.js (v18 or higher)
- npm (Node Package Manager)

### Installation & Setup

1. Clone the repository:
```bash
git clone https://github.com/Cornell-Tech-AIRLab/crash-cart-motion.git
cd crash-cart-motion_web-interface
```

2. Install Frontend Dependencies:
```bash
cd frontend
npm install
```

3. Install Backend Dependencies:
```bash
cd ../backend
npm install
```

### Running the Application

You'll need to run both the frontend and backend servers in separate terminal windows.

#### Start the Backend Server

1. Open a terminal and navigate to the backend folder:
```bash
cd backend
node --watch server.js
```
The backend server will start on http://localhost:8080

#### Start the Frontend Development Server

2. Open a new terminal and navigate to the frontend folder:
```bash
cd frontend
npm run dev
```
The frontend development server will start on http://localhost:5173

### Verifying the Setup

1. Open your browser and navigate to http://localhost:5173
2. The inventory tracker interface should load
3. The search functionality should work if the backend is running properly

### Troubleshooting

- If you see CORS errors in the console, ensure both servers are running
- If the frontend can't connect to the backend, verify the backend server is running on port 8080
- Check the browser console and terminal outputs for error messages

**Appendix**
- Web Interface GitHub repo: https://github.com/Cornell-Tech-AIRLab/crash-cart-motion
