
const WebSocket = require('ws');

class Session {

    constructor(state) {
        this.id = 'ABC123'; // Should be randomized
        this.state = state || {};
    }
}

class Server {

    constructor(game) {
        this.wss = null;
        this.sessions = {};
        this.game = game;

        this.start = this.start.bind(this);
        this.onConnectionOpened = this.onConnectionOpened.bind(this);
        this.onConnectionClosed = this.onConnectionClosed.bind(this);
        this.onMessageReceived = this.onMessageReceived.bind(this);
    }

    start() {
        this.wss = new WebSocket.Server({ port: 8080 });
        this.wss.on('connection', (ws) => {
            ws.on('open', () => {
                this.onConnectionOpened(ws);
            });
            ws.on('close', () => {
                this.onConnectionClosed(ws);
            });
            ws.on('message', (message) => {
                this.onMessageReceived(ws, message);
            });
        });
        this.game.start();
    }

    onConnectionOpened(ws) {
        let session = new Session();
        this.sessions[session.id] = session;
        ws.send({
            session_id: session.id
        });
    }

    onConnectionClosed(ws) {
        // Delete session
    }

    onMessageReceived(ws,  data) {
        let sessionId = data['session_id'] || null;
        if (!sessionId) {
            ws.send({ error: 'You must supply a session id' });
            return;
        }

        let session = this.sessions[sessionId];
        if (!session) {
            ws.send({ error: `No session found with id: ${sessionId}` });
            return;
        }

        this.game.pushCommand(data);

        ws.send(session);
    }
}

module.exports = {
    'Server': Server,
    'Session': Session
};

