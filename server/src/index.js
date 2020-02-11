
const { Game, GameState } = require('./game');
const Queue = require('./queue');
const { Server } = require('./server');
const ResourceLoader = require('./loader');

let availableCommands = {
    'register_player': function(state, session, data) {
        let player = state.registerPlayer(data['player_id'], data['player_name']);
        session.data = state.createStateForPlayer(player);
    },
    'login_player': function(state, session, data) {
        let player = state.loginPlayer(data['player_id']);
        session.data = state.createStateForPlayer(player);
    },
    'logout_player': function(state, session, data) {
        state.logoutPlayer(data['player_id']);
        delete session.data;
    },
    'move': function(state, session, params) {
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

    execute(state, session, command) {
        switch (command.action) {
            case 'move':
            case 'goto':
                state = this.commands['move'](state, session, command.data);
                break;
            case 'register_player':
            case 'login_player':
            case 'logout_player':
                state = this.commands[command.action](state, session, command.data);
                break;
            default:
                throw new Error(`Invalid command given: ${command.action}`);
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

