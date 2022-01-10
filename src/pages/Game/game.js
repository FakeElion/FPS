import React, { Component } from 'react'
import * as THREE from 'three'
import Client from './client'
import Networking from "./network";
import Enemy from "./enemy";

class Game extends Component {
    constructor(props) {
        super(props)

        this.start = this.start.bind(this)
        this.stop = this.stop.bind(this)
        this.animate = this.animate.bind(this)
    }

    addPlayer(player) {
        this.players.push(player)
    }

    handleUpdate(data) {
        data.players.forEach(player => {
            const playerObject = this.players.find(player2 => player2.id === player.id);

            if (playerObject) {
                Object.entries(player).forEach(player => {
                    playerObject[player[0]] = player[1];
                });
            } else {
                if (player.id !== this.id)
                    this.addEnemy(player);
            }
        })
    }

    async componentDidMount() {
        const networking = new Networking();

        this.networking = networking;

        this.players = []

        const width = this.mount.clientWidth
        const height = this.mount.clientHeight

        const scene = new THREE.Scene()
        const camera = new THREE.PerspectiveCamera(
            75,
            width / height,
            0.1,
            1000
        )

        const renderer = new THREE.WebGLRenderer({ antialias: true })
        const geometry = new THREE.BoxGeometry(15, 1, 15)
        const material = new THREE.MeshBasicMaterial({ color: '#433F81' })
        const cube = new THREE.Mesh(geometry, material)

        camera.position.y = 2
        scene.add(cube)
        renderer.setClearColor('#000000')
        renderer.setSize(width, height)

        this.scene = scene
        this.camera = camera
        this.renderer = renderer
        this.material = material
        this.cube = cube

        this.client = new Client(camera)

        this.mount.appendChild(this.renderer.domElement)

        await networking.connect(this);
        this.id = networking.id;
        this.start()
    }

    componentWillUnmount() {
        this.stop()
        this.mount.removeChild(this.renderer.domElement)
    }

    start() {
        if (!this.frameId) {
            this.frameId = requestAnimationFrame(this.animate)
        }
    }

    stop() {
        cancelAnimationFrame(this.frameId)
    }

    addEnemy(data) {
        const enemy = new Enemy(this, data);
        enemy.init(data);
    }

    animate() {
        this.client.update()
        this.players.forEach(player => player.update());

        this.renderer.render(this.scene, this.camera)
        this.frameId = window.requestAnimationFrame(this.animate)
    }

    render() {
        return (
            <div
                style={{ width: '100vw', height: '100vh' }}
                ref={(mount) => { this.mount = mount }}
            />
        )
    }
}

export default Game