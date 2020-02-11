
const ws = new WebSocket('ws://127.0.0.1:8080');

var currentSession = { session_id: null, session_hash: null };

ws.addEventListener('open', (event) => {
    console.log('Connected', event);
});

ws.addEventListener('message', (event) => {
    let payload = JSON.parse(event.data);

    let response = payload['response'] || {};

    if (response['action'] == 'start_session') {
        currentSession = payload;
        console.log(payload);
    }

    console.log('Message', event);
});

ws.addEventListener('error', (event) => {
    console.log('Error', event);
});

function createEvent(name, session) {
    let payload = {};
    switch (name) {
        case 'register_player':
            payload = {
                session_id: session.session_id,
                session_hash: session.session_hash,
                action: 'register_player',
                data: {
                    player_id: 123,
                    player_name: 'mcross'
                }
            };
            break;
        case 'login_player':
            payload = {
                session_id: session.session_id,
                session_hash: session.session_hash,
                action: 'login_player',
                data: {
                    player_id: 123
                }
            };
            break;
        case 'logout_player':
            payload = {
                session_id: session.session_id,
                session_hash: session.session_hash,
                action: 'logout_player',
                data: {
                    player_id: 123
                }
            };
            break;
    }

    console.log('Payload', payload);

    return JSON.stringify(payload);
}

setTimeout(() => {
    ws.send(createEvent('register_player', currentSession));
}, 1000);
