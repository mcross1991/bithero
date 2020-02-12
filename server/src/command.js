
class Command {

    constructor(name, actionCallback) {
        this.actionName = name;
        this.actionCallback = actionCallback;

        this.isSameAction = this.isSameAction.bind(this);
        this.execute = this.execute.bind(this);
    }

    isSameAction(action) {
        return this.action == action;
    }

    execute(state, session, data) {
        this.actionCallback(state, session, data);
    }
}

class CommandExecutor {

    constructor(commands) {
        this.commands = commands;
        this.execute = this.execute.bind(this);
    }

    execute(state, session, request) {
        let command = this.findCommandForAction(request.action);

        command.execute(state, session, request.data);

        if (session.data && session.data.player) {
            session.data.player.data.lastActionTime = new Date();
        }
    }

    findCommandForAction(actionName) {
        let command = null;
        for (let actual of this.commands) {
            if (actual.actionName == actionName) {
                command = actual;
                break;
            }
        }

        if (command === null) {
            throw new Error(`Invalid command action: ${actionName}`);
        }

        return command;
    }
}

const registerPlayer = new Command('register_player', function(state, session, data) {
    let player = state.registerPlayer(data['player_id'], data['player_name']);
    session.data = state.createStateForPlayer(player);
});

const loginPlayer = new Command('login_player', function(state, session, data) {
    let player = state.loginPlayer(data['player_id']);
    session.data = state.createStateForPlayer(player);
});

const logoutPlayer = new Command('register_player', function(state, session, data) {
    state.logoutPlayer(data['player_id']);
    delete session.data;
});

CommandExecutor.create = function() {
    return new CommandExecutor([
        registerPlayer,
        loginPlayer,
        logoutPlayer
    ]);
}

module.exports = CommandExecutor;

