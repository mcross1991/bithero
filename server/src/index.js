
const CommandExecutor = require('./command');
const { Game, GameState } = require('./game');
const { Server } = require('./server');
const ResourceLoader = require('./loader');

const loader = new ResourceLoader('src/configs');
const resources = loader.loadAllResources();

const executor = CommandExecutor.create();

const game = new Game(resources, executor);

console.log('Starting Server');
const server = new Server(game);
server.start();

