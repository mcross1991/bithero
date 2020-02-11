
const { Game, GameState } = require('./game');
const Queue = require('./queue');
const { Server } = require('./server');
const ResourceLoader = require('./loader');

let availableCommands = {
    'register_player': function(state, data) {
        let player = state.registerPlayer(123, data['name']);
        state.createStateForPlayer(player);
    },
    'move': function(state, params) {
        let playerId = params['playerId'];
        let player = state.findPlayer(playerId);
        if (!player) {
            return;
        }

        let area = params['area'];
        player.setCurrentArea(area);
        state.updatePlayer(player);
    }
};

class CommandExecutor {

    constructor(commands) {
        this.commands = commands;

        this.execute = this.execute.bind(this);
    }

    execute(state, command) {
        switch (command.action) {
            case 'move':
            case 'goto':
                state = this.commands['move'](state, command.data);
                break;
            case 'register_player':
            case 'inspect':
            case 'speak':
            case 'attack':
            case 'cast':
            case 'skill':
                state = this.commands[command.action](state, command.data);
                break;
        }
    }
}

const loader = new ResourceLoader('src/configs');
const resources = loader.loadAllResources();
const executor = new CommandExecutor(availableCommands);

const game = new Game(resources, executor);

console.log('Starting Server');
const server = new Server(game);
server.start();

