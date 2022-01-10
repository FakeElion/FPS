import * as THREE from 'three'

export default function Enemy(game) {
    this.game = game;
    this.id = null;
    this.position = {}

    this.init = (data) => {
        const geometry = new THREE.BoxGeometry(1, 2, 1)
        const material = new THREE.MeshBasicMaterial({ color: '#813f3f' })
        const cube = new THREE.Mesh(geometry, material)

        this.game.scene.add(cube)
        this.id = data.id;
        this.model = cube;

        this.position.x = data.position.x;
        this.position.y = data.position.y;
        this.position.z = data.position.z;

        this.game.addPlayer(this)
    }

    this.update = () => {
        this.model.position.x = this.position.x;
        this.model.position.y = this.position.y;
        this.model.position.z = this.position.z;
    }
}