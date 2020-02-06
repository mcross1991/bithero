
const { Game, GameState } = require('./game');
const Queue = require('./queue');
const Server = require('./server');
const ResourceLoader = require('./loader');

let availableCommands = {
    'move': function(state, params) {
        let playerId = params['playerId'];
        let player = state.findPlayer(playerId);
        if (!player) {
            return state;
        }

        let area = params['area'];
        player.setCurrentArea(area);
        state.updatePlayer(player);

        // Maybe return custom response here for client?
        return state;
    }
};

class CommandExecutor {

    constructor(commands) {
        this.commands = commands;
    }

    execute(state, command) {
        switch (command.name) {
            case 'move':
            case 'goto':
                state = this.commands['move'](state, command.params);
                break;
            case 'inspect':
            case 'speak':
            case 'attack':
            case 'cast':
            case 'skill':
                state = this.commands[command.name](state, command.params);
                break;
        }
        return state;
    }
}

const loader = new ResourceLoader('src/configs');
const resources = loader.loadAllResources();

const game = new Game(resources);

const server = new Server(game);
server.start();

