
const Queue = require('./queue');

class GameState {

    constructor() {
        this.players = [];
    }

    /**
     * Player API
     */
    registerPlayer(playerId) {
    
    }

    logoutPlayer(playerId) {
    
    }

    findPlayer(playerId) {
    
    }

    updatePlayer(player) {
    
    }

    /**
     * Session API
     */
    getSessionForPlayer(playerId) {
    
    }

    createSessionForPlayer(player) {

    }
}

class Game {

    constructor(resources, executor) {
        this.queue = new Queue();
        this.resources = this.resources;
        this.executor = executor;
        this.state = new GameState();
        this.hasEnded = false;
        this.intervalLock = null;

        this.start = this.start.bind(this);
        this.end = this.end.bind(this);
        this.pushCommand = this.pushCommand.bind(this);
        this.updateState = this.updateState.bind(this);
    }

    start() {
        this.hasEnded = false;

        this.intervalLock = setInterval(() => {
            if (this.hasEnded) {
                clearInterval(this.intervalLock);
                return;
            }

            this.updateState();
        }, 500);
    }

    end() {
        this.hasEnded = true;
    }

    pushCommand(command) {
        this.queue.push(command);
    }

    updateState() {
        while (!this.queue.empty()) {
            this.state = this.executor.execute(this, this.queue.pop());
        }
    }
}

module.exports = {
    'Game': Game,
    'GameState': GameState,
};

