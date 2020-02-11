
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
        fs.writeFileSync(this.getPathForData('players', `${player.id}.json`), player.toJSON());
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
            area: this.resources.loadResource('area', 'elevir', 'central')
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
        this.onSessionUpdatedCallbackCache = {};
        this.intervalLock = null;

        this.start = this.start.bind(this);
        this.end = this.end.bind(this);
        this.updateState = this.updateState.bind(this);
        this.sendCommand = this.sendCommand.bind(this);
        this.onSessionUpdated = this.onSessionUpdated.bind(this);
    }

    start() {
        this.intervalLock = setInterval(() => {
            this.updateState();
        }, 100);
    }

    end() {
        clearInterval(this.intervalLock);
    }

    updateState() {
        while (!this.queue.isEmpty()) {
            let data = this.queue.pop();
            this.executor.execute(this.state, data.command);
            this.onSessionUpdatedCallbackCache[data.sessionId]
        }
    }

    sendCommand(sessionId, command) {
        this.queue.push({sessionId: sessionId, command: command});
    }

    onSessionUpdated(session, callback) {
        this.onSessionUpdatedCallbackCache[session.id] = callback;
    }
}

module.exports = {
    'Game': Game,
    'GameState': GameState,
};

