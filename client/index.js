
const ws = new WebSocket('ws://127.0.0.1:8080');

let currentSession = { id: null, hash: null };

ws.addEventListener('open', (event) => {
    console.log('Connected', event);
});

ws.addEventListener('message', (event) => {
    let payload = JSON.parse(event.data);

    if (payload['action'] == 'start_session') {
        currentSession = payload;
    }

    console.log('Message', event);
});

ws.addEventListener('error', (event) => {
    console.log('Error', event);
});

function createEvent(name) {
    let payload = {};
    switch (name) {
        case 'register_player':
            payload = {
                session_id: currentSession.id,
                session_hash: currentSession.hash,
                action: 'register_player',
                data: { name: 'mcross' }
            };
            break;
    }

    console.log('Payload', payload);

    return JSON.stringify(payload);
}

setTimeout(() => {
    ws.send(createEvent('register_player'));
}, 1000);
