const WebSocket = require('ws');

const wsServer = new WebSocket.Server({port: 9000});
const tick = 15;
const players = []

const sendToAllClientsExcept = (id, message) => {
    players.forEach(player => {
        if (id !== player.id) {
            player.client.send(JSON.stringify(message))
        }
    })
}

const onConnect = (client) => {
    console.log('new client connection')

    client.on('message', (message) => {
        message = JSON.parse(message);

        if (message.identifier === 'NEW_CLIENT') {
            client.id = message.data.id;
            const player = {
                ...message.data,
                position: {x: 0, y: 1, z: 0},
            };

            players.push({
                ...player, client
            })

            client.send(JSON.stringify({ identifier: 'CLIENT_ACCEPTED', data: {} }));

            sendToAllClientsExcept(client.id, {
                identifier: 'NEW_PLAYER', data: player
            });
        }

        if (message.identifier === 'UPDATE') {
            const playerIndex = players.findIndex(player => player.id === message.data.id);

            Object.entries(message.data.update_properties).forEach(property => {
                players[playerIndex][property[0]] = property[1];
            })
        }
    })

    client.on('close', () => {
        players.splice(players.findIndex(player => player.id === client.id), 1)
    })
}

wsServer.on('connection', onConnect);

setInterval(() => {
    players.forEach(player => {
        sendToAllClientsExcept(player.id, {
            identifier: 'UPDATE',
            players: players.filter(playerPosition => playerPosition.id === player.id).map(playerPosition => ({position: playerPosition.position, id: playerPosition.id}))
        })
    });
}, 1000 / tick)