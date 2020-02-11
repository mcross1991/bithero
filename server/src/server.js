
const WebSocket = require('ws');
const uuid = require('uuid/v4');

class Session {

    constructor(id, hash) {
        this.id = id;
        this.hash = hash;
        this.request = null;
        this.response = null;
    }

    setRequest(request) {
        this.request = request;
    }

    getRequest() {
        return this.request;
    }

    setResponse(response) {
        this.response = response;
    }

    getResponse() {
        return this.response;
    }

    toJSON() {
        return JSON.stringify({
            session_id: this.id,
            session_hash: this.hash,
            request: this.request,
            response: this.response
        });
    }
}

Session.create = function(data=null) {
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
            this.onConnectionOpened(ws);

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
        let session = Session.create();

        this.sessions[session.id] = session;

        this.game.registerConnection(session, (updatedSession) => {
            ws.send(JSON.stringify(updatedSession));
        });

        session.setResponse({ action: 'start_session' });

        ws.send(session.toJSON());
    }

    onConnectionClosed(ws) {
        // Delete session
    }

    onMessageReceived(ws, data) {
        let request = JSON.parse(data);
        if (!request) {
            ws.send(this.jsonError('Invalid JSON sent to server'));
            return;
        }

        let sessionId = request['session_id'] || null;
        if (!sessionId) {
            ws.send(this.jsonError('You must supply a session id'));
            return;
        }

        let sessionHash = request['session_hash'] || null;
        if (!sessionHash) {
            ws.send(this.jsonError('You must supply a session hash'));
            return;
        }

        let session = this.sessions[sessionId];
        if (!session || session.hash != sessionHash) {
            ws.send(this.jsonError(`No session found with id ${sessionId}`));
            return;
        }

        session.setRequest(request);

        this.game.sendCommand(session);
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

