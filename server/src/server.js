
const WebSocket = require('ws');
const uuid = require('uuid/v4');

class Session {

    constructor(id, hash, data) {
        this.id = id;
        this.hash = hash;
        this.data = data;
    }
}

Session.create = function(data={}) {
    return new Session(uuid(), uuid(), data);
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
        this.infoMessage = this.infoMessage.bind(this);
        this.jsonError = this.jsonError.bind(this);
    }

    start() {
        this.wss = new WebSocket.Server({ port: 8080 });
        this.wss.on('connection', (ws, request) => {
            // request provides user unique info
            this.onConnectionOpened(ws);

            ws.on('close', () => {
                this.onConnectionClosed(ws);
            });
            ws.on('message', (message) => {
                this.onMessageReceived(ws, message);
            });
        });
    }

    onConnectionOpened(ws) {
        let session = Session.create();
        this.sessions[session.id] = session;
        ws.send(JSON.stringify({
            session_id: session.id,
            session_hash: session.hash,
            action: 'start_session'
        }));
    }

    onConnectionClosed(ws) {
        // Delete session
    }

    onMessageReceived(ws, data) {
        let command = JSON.parse(data);
        if (!command) {
            ws.send(this.jsonError('Invalid JSON sent to server'));
            return;
        }

        let sessionId = command['session_id'] || null;
        if (!sessionId) {
            ws.send(this.jsonError('You must supply a session id'));
            return;
        }

        let sessionHash = command['session_hash'] || null;
        if (!sessionHash) {
            ws.send(this.jsonError('You must supply a session hash'));
            return;
        }

        let session = this.sessions[sessionId];
        if (!session || session.hash != sessionHash) {
            ws.send(this.jsonError(`No session found with id ${sessionId}`));
            return;
        }

        this.game.onSessionUpdated(session, (updatedSession) => {
            ws.send(JSON.stringify(updatedSession));
        });

        this.game.sendCommand(command);

        ws.send(JSON.stringify(session));
    }

    infoMessage(message) {
        return JSON.stringify({ 'message': message });
    }

    jsonError(message) {
        return JSON.stringify({ error: message });
    }
}

module.exports = {
    'Server': Server,
    'Session': Session
};

