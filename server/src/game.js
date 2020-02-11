
const fs = require('fs');
const path = require('path');
const Queue = require('./queue');
const Player = require('./models/player');

class GameState {

    constructor(resources) {
        this.resources = resources;
        this.players = {};
        this.states = {};
    }

    /**
     * Player API
     */
    registerPlayer(playerId, playerName) {
        let player = Player.newPlayer(playerId, playerName);
        this.savePlayerFile(player);
        this.players[playerId] = player;
        return player;
    }

    loginPlayer(playerId) {
        let player = this.loadPlayerFile(playerId);
        this.players[player.id] = player;
        return player;
    }

    logoutPlayer(playerId) {
        if (typeof this.players[playerId] == 'undefined') {
            return;
        }

        this.savePlayerFile(this.players[playerId].toJSON());
        delete this.players[playerId];
    }

    findPlayer(playerId) {
        if (typeof this.players[playerId] == 'undefined') {
            return null;
        }
        return this.players[playerId];
    }

    updatePlayer(player) {
        this.players[player.id] = player;
    }

    savePlayerFile(player) {
        fs.writeFileSync(this.getPathForData('players', `${player.data.id}.json`), player.toJSON());
    }

    loadPlayerFile(playerId) {
        let data = JSON.parse(fs.readFileSync(this.getPathForData('players', `${playerId}.json`)));
        if (!data) {
            throw new Error(`Could not load player ${playerId}`);
        }
        return new Player(data);
    }

    getPathForData(category, filename) {
        return path.join('data', category, filename);
    }

    /**
     * State API
     */
    getStateForPlayer(player) {
        if (typeof this.states[player.id] != 'undefined') {
            throw new Error(`Invalid player id given ${player.id}`);
        }
        return this.states[player.id];
    }

    hasStateForPlayer(player) {
        return typeof this.states[player.id] != 'undefined';
    }

    createStateForPlayer(player) {
        let state = {
            player: player,
            otherPlayers: [],
            area: {}, //this.resources.loadResource('area', 'elevir', 'central')
        };

        this.states[player.id] = state;

        return state;
    }
}

class Game {

    constructor(resources, executor) {
        this.resources = resources;
        this.executor = executor;
        this.queue = new Queue();
        this.state = new GameState(resources);
        this.sessions = {};
        this.intervalLock = null;

        this.start = this.start.bind(this);
        this.end = this.end.bind(this);
        this.updateState = this.updateState.bind(this);
        this.broadcastStateToPlayers = this.broadcastStateToPlayers.bind(this);
        this.sendCommand = this.sendCommand.bind(this);
        this.registerSession = this.registerSession.bind(this);
        this.getSession = this.getSession.bind(this);
    }

    start() {
        this.intervalLock = setInterval(() => {
            this.updateState();
            this.broadcastStateToPlayers();
        }, 100);
    }

    end() {
        clearInterval(this.intervalLock);
    }

    updateState() {
        while (!this.queue.isEmpty()) {
            let nextAction = this.queue.pop();
            let sessionConfig = this.sessions[nextAction.session_id];

            this.executor.execute(this.state, sessionConfig.session, nextAction);

            sessionConfig.callback(sessionConfig.session);
        }
    }

    broadcastStateToPlayers() {
        for (let id in this.sessions) {
            let config = this.sessions[id];
            config.callback(config.session);
        }
    }

    sendCommand(command) {
        this.queue.push(command);
    }

    registerSession(session, callback) {
        this.sessions[session.id] = {
            'session': session,
            'callback': callback
        };
    }

    getSession(id) {
        if (typeof this.sessions[id] == 'undefined') {
            throw new Error(`Session with id ${id} does not exist`);
        }
        return this.sessions[id].session;
    }
}

module.exports = {
    'Game': Game,
    'GameState': GameState,
};

