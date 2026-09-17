// CueBot backend: serves the cart inventory, item images, and speech clips
// to the web interface, and relays inventory state updates over Socket.IO.
// The physical LEDs are operated by the Wizard-of-Oz operator, not by this
// server; the ledStates field is only used by the earlier inventory-tracker view.

import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Which cart layout to load: "layperson" (general-purpose supplies) or
// "rn" (medical crash-cart supplies). Set with the CUEBOT_CART variable.
const CART = process.env.CUEBOT_CART || 'layperson';
const PORT = Number(process.env.PORT) || 8080;
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || 'http://localhost:5173';

const inventoryFile = path.join(__dirname, `inventory-${CART}.json`);
if (!fs.existsSync(inventoryFile)) {
    console.error(`Unknown cart "${CART}". Expected a file named inventory-${CART}.json in ${__dirname}.`);
    process.exit(1);
}

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: FRONTEND_ORIGIN,
        methods: ['GET', 'POST']
    }
});

app.use(express.json());
app.use(cors());

// Item images and speech clips for both carts.
app.use('/public', express.static(path.join(__dirname, 'public')));

let currentInventory = [];
let currentLedStates = [];
let currentDeprecatedStates = [];

const loadInventoryData = () => {
    const data = JSON.parse(fs.readFileSync(inventoryFile, 'utf8'));
    currentInventory = data.inventory;
    currentLedStates = data.ledStates;
    currentDeprecatedStates = data.isDeprecated;
};

loadInventoryData();

// Asset paths in the inventory files are relative (e.g. /public/images-rn/n95.png).
// Turn them into full URLs so the browser can load them from this server.
const withAbsoluteUrls = (inventory, baseUrl) =>
    inventory.map((drawer) => ({
        ...drawer,
        compartments: drawer.compartments.map((c) => ({
            ...c,
            image: c.image && c.image.startsWith('/') ? `${baseUrl}${c.image}` : c.image,
            audio: c.audio && c.audio.startsWith('/') ? `${baseUrl}${c.audio}` : c.audio
        }))
    }));

io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    // A client can push updated inventory and LED state; it is stored and
    // broadcast to every connected interface.
    socket.on('data', (data) => {
        const { inventory, ledStates, isDeprecated } = data;

        currentInventory = inventory;
        currentLedStates = ledStates;
        currentDeprecatedStates = isDeprecated;

        io.emit('data', data);
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
    });
});

app.get('/api/data', (req, res) => {
    try {
        const baseUrl = `${req.protocol}://${req.get('host')}`;
        res.json({
            cart: CART,
            inventory: withAbsoluteUrls(currentInventory, baseUrl),
            ledStates: currentLedStates,
            isDeprecated: currentDeprecatedStates
        });
    } catch (e) {
        console.error('Error responding to /api/data:', e);
        res.sendStatus(500);
    }
});

server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is already in use. Stop the other program using it, or start CueBot on another port (e.g. PORT=8081 npm start) and update VITE_API_URL in frontend/.env.`);
        process.exit(1);
    }
    throw err;
});

server.listen(PORT, () => {
    console.log(`CueBot backend listening on http://localhost:${PORT} (cart: ${CART})`);
});
