import * as UUID from 'uuid'

export default function Networking() {
    this.tick = 30;
    this.game = null;

    this.tickUpdate = () => {
        this.socket.send(JSON.stringify({
            identifier: 'UPDATE',
            data: {
                id: this.id,
                update_properties: {
                    position: {
                        x: this.game.camera.position.x,
                        z: this.game.camera.position.z,
                        y: this.game.camera.position.y
                    }
                }
            }
        }));
    }

    this.connect = async (game) => {
        const id = UUID.v4();

        this.game = game;
        this.id = id;

        const socket = new WebSocket("ws://localhost:9000");

        this.socket = socket;

        socket.onmessage = (event) => {
            const data = JSON.parse(event.data);

            if (data.identifier === 'CLIENT_ACCEPTED') {
                setInterval(this.tickUpdate, 1000 / this.tick)
            }

            if (data.identifier === 'UPDATE') {
                this.game.handleUpdate(data)
            }
        }

        socket.onopen = (event) => {
            socket.send(JSON.stringify({ identifier: 'NEW_CLIENT', data: { id }}))
        }
    }
}