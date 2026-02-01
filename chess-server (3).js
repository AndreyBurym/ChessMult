const WebSocket = require('ws');
const http = require('http');

const server = http.createServer();
const wss = new WebSocket.Server({ server });

const lobbies = new Map();

function generateLobbyCode() {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
}

wss.on('connection', (ws) => {
    console.log('New client connected');
    
    ws.on('message', (message) => {
        try {
            const data = JSON.parse(message);
            console.log('Received:', data.type);
            
            switch(data.type) {
                case 'CREATE_LOBBY':
                    handleCreateLobby(ws, data);
                    break;
                case 'JOIN_LOBBY':
                    handleJoinLobby(ws, data);
                    break;
                case 'MAKE_MOVE':
                    handleMove(ws, data);
                    break;
                case 'CANCEL_LOBBY':
                    handleCancelLobby(ws, data);
                    break;
                case 'DISCONNECT':
                    handleDisconnect(ws);
                    break;
            }
        } catch (error) {
            console.error('Error processing message:', error);
        }
    });
    
    ws.on('close', () => {
        console.log('Client disconnected');
        handleDisconnect(ws);
    });
});

function handleCreateLobby(ws, data) {
    const code = generateLobbyCode();
    const lobby = {
        code: code,
        name: data.lobbyName || 'Chess Game',
        hasPassword: data.hasPassword || false,
        password: data.password || null,
        host: ws,
        guest: null,
        hostColor: 'white',
        guestColor: 'black'
    };
    
    lobbies.set(code, lobby);
    ws.lobbyCode = code;
    ws.isHost = true;
    
    ws.send(JSON.stringify({
        type: 'LOBBY_CREATED',
        code: code,
        color: 'white'
    }));
    
    console.log(`Lobby created: ${code}`);
}

function handleJoinLobby(ws, data) {
    const lobby = lobbies.get(data.code);
    
    if (!lobby) {
        ws.send(JSON.stringify({
            type: 'ERROR',
            message: 'Lobby not found'
        }));
        return;
    }
    
    if (lobby.guest) {
        ws.send(JSON.stringify({
            type: 'ERROR',
            message: 'Lobby is full'
        }));
        return;
    }
    
    if (lobby.hasPassword && lobby.password !== data.password) {
        ws.send(JSON.stringify({
            type: 'ERROR',
            message: 'Incorrect password'
        }));
        return;
    }
    
    lobby.guest = ws;
    ws.lobbyCode = data.code;
    ws.isHost = false;
    
    ws.send(JSON.stringify({
        type: 'LOBBY_JOINED',
        code: data.code,
        color: 'black'
    }));
    
    lobby.host.send(JSON.stringify({
        type: 'OPPONENT_JOINED'
    }));
    
    setTimeout(() => {
        if (lobby.host && lobby.guest) {
            lobby.host.send(JSON.stringify({ type: 'START_GAME', color: 'white' }));
            lobby.guest.send(JSON.stringify({ type: 'START_GAME', color: 'black' }));
        }
    }, 5000);
    
    console.log(`Player joined lobby: ${data.code}`);
}

function handleMove(ws, data) {
    const lobby = lobbies.get(ws.lobbyCode);
    if (!lobby) return;
    
    const opponent = ws.isHost ? lobby.guest : lobby.host;
    if (opponent && opponent.readyState === WebSocket.OPEN) {
        opponent.send(JSON.stringify({
            type: 'OPPONENT_MOVE',
            move: data.move
        }));
    }
}

function handleCancelLobby(ws, data) {
    const lobby = lobbies.get(data.code);
    if (!lobby) return;
    
    if (lobby.guest) {
        lobby.guest.send(JSON.stringify({
            type: 'LOBBY_CANCELLED',
            message: 'Host cancelled the lobby'
        }));
    }
    
    lobbies.delete(data.code);
    console.log(`Lobby cancelled: ${data.code}`);
}

function handleDisconnect(ws) {
    if (!ws.lobbyCode) return;
    
    const lobby = lobbies.get(ws.lobbyCode);
    if (!lobby) return;
    
    const opponent = ws.isHost ? lobby.guest : lobby.host;
    if (opponent && opponent.readyState === WebSocket.OPEN) {
        opponent.send(JSON.stringify({
            type: 'OPPONENT_DISCONNECTED',
            message: 'Your opponent disconnected'
        }));
    }
    
    lobbies.delete(ws.lobbyCode);
    console.log(`Lobby closed due to disconnect: ${ws.lobbyCode}`);
}

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
    console.log(`Chess multiplayer server running on port ${PORT}`);
});
