import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:5173',
        methods: ['GET', 'POST']
    }
});

const PORT = 8080;

app.use(express.json());
app.use(cors());
app.use(['/public/images'], express.static(path.join(__dirname, 'public/images')));
app.use(['/public/audio'], express.static(path.join(__dirname, 'public/audio')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../ccr_web_frontend/index.html'));
});

let currentInventory = [];
let currentLedStates = [];
let currentDeprecatedStates = [];

const loadInventoryData = () => {
    const data = JSON.parse(fs.readFileSync(path.join(__dirname, 'inventory.json'), 'utf8'));
    currentInventory = data.inventory;
    currentLedStates = data.ledStates;
    currentDeprecatedStates = data.isDeprecated;
};

loadInventoryData();

io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    socket.on('data', (data) => {
        console.log('Received data:', data);
        const { inventory, ledStates, isDeprecated } = data;
        
        currentInventory = inventory;
        currentLedStates = ledStates;
        currentDeprecatedStates = isDeprecated;

        inventory.forEach((item, index) => {
            console.log(`Compartment ${index + 1} - ${item.name}: ${item.count}, LED: ${ledStates[index] ? 'On' : 'Off'}, Deprecated: ${isDeprecated[index]}`);
        });

        io.emit('data', data);
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
    });
});

app.get('/api/data', (req, res) => {
    try {
        res.json({
            inventory: currentInventory,
            ledStates: currentLedStates,
            isDeprecated: currentDeprecatedStates
        });
    } catch (e) {
        console.error('Error responding to /api/data:', e);
        res.sendStatus(500);
    }
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../ccr_web_frontend/index.html'));
});

server.listen(PORT, () => {
    console.log(`Web server listening on port ${PORT}`);
});