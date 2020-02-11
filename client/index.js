
const ws = new WebSocket('ws://127.0.0.1:8080');

ws.addEventListener('open', (event) => {
    console.log('Connected');
    ws.send(JSON.stringify(createEvent('register_player')));
});

ws.addEventListener('message', (event) => {
    console.log('Message', event);
});

ws.addEventListener('error', (event) => {
    console.log('Error', event);
});

function createEvent(name) {
    let payload = {};
    switch (name) {
        case 'register_player':
            payload = { session_id: 123, session_hash: 'ABCEDFG', action: 'register_player', data: { name: 'mcross' } };
            break;
    }

    console.log('Payload', payload);

    return payload;
}


