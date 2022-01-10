import * as THREE from 'three'

const FORWARD = 1;
const SIDE = 2;

export default function Client(camera) {
    this.rotateCamera = (e) => {
        console.log('tes')
        const movementX = e.movementX;
        const movementY = e.movementY;

        this.camera.rotation.x -= movementY * 0.005;
        this.camera.rotation.y -= movementX * 0.005;
    }

    this.horizontalInput = (value, direction, activate) => {
        if (direction === FORWARD) {
            this.accelarationZ = value;

            if (! activate)
                this.accelarationZ = 0;
        }

        if (direction === SIDE) {
            console.log(value)
            this.accelarationX = value

            if (! activate)
                this.accelarationX = 0;
        }
    }

    this.update = () => {
        this.camera.position.z -= this.accelarationZ * 0.08;
        this.camera.position.x += this.accelarationX * 0.08;
    }

    this.camera = camera
    this.accelarationZ = 0
    this.accelarationX = 0

    this.inputs = {
        w: (activate) => { this.horizontalInput(1, FORWARD, activate) },
        s: (activate) => { this.horizontalInput(-1, FORWARD, activate) },
        d: (activate) => { this.horizontalInput(1, SIDE, activate) },
        a: (activate) => { this.horizontalInput(-1, SIDE, activate) },
    }

    document.addEventListener("keydown", event => {
        Object.entries(this.inputs).forEach(input => {
            if (event.key === input[0]) {
                input[1](true);
            }
        })
    });

    document.addEventListener("keyup", event => {
        Object.entries(this.inputs).forEach(input => {
            if (event.key === input[0]) {
                input[1](false);
            }
        })
    });

    document.addEventListener('mousemove', this.rotateCamera.bind(this));
}