import './style.css'
import * as THREE from 'three'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'
import {Reflector} from 'three/examples/jsm/objects/Reflector'
import GUI from 'lil-gui'

/*----Textures----*/
const textureLoader = new THREE.TextureLoader()
// Walls
const floorColor = textureLoader.load('./textures/floor/color.jpg')
const floorNormal = textureLoader.load('./textures/floor/normal.jpg')
const floorAom = textureLoader.load('./textures/floor/aom.jpg')
const floorRough = textureLoader.load('./textures/floor/rough.jpg')
floorColor.repeat.x = 5
floorColor.repeat.y = 5
floorColor.wrapS = THREE.RepeatWrapping
floorColor.wrapT = THREE.RepeatWrapping
floorNormal.repeat.x = 5
floorNormal.repeat.y = 5
floorNormal.wrapS = THREE.RepeatWrapping
floorNormal.wrapT = THREE.RepeatWrapping
floorAom.repeat.x = 5
floorAom.repeat.y = 5
floorAom.wrapS = THREE.RepeatWrapping
floorAom.wrapT = THREE.RepeatWrapping
floorRough.repeat.x = 5
floorRough.repeat.y = 5
floorRough.wrapS = THREE.RepeatWrapping
floorRough.wrapT = THREE.RepeatWrapping
/*----End textures----*/

// Debug gui
const gui = new GUI()

// Scene
const scene = new THREE.Scene()

/*----Lights----*/
// Ambient light
const ambientLight = new THREE.AmbientLight(0xffffff,.85)
// Point light
const pointLight = new THREE.PointLight(0xFFFFED, .7, 10)
pointLight.position.set(2.5, 3, 2)
pointLight.castShadow = true

scene.add(ambientLight, pointLight)
/*----End lights----*/

/*----Objects----*/
// Materials
const concrete = new THREE.MeshStandardMaterial({color: 0xdddddd})
concrete.roughness = 1


// Room
const room = new THREE.Group()
// room.position.set(2.5,1.5,0)
scene.add(room)

// Walls
const frontWall = new THREE.Mesh(
    new THREE.PlaneGeometry(5,3),
    concrete
)
frontWall.receiveShadow = true
frontWall.position.set(2.5,1.5,0)
const leftWall = new THREE.Mesh(
    new THREE.PlaneGeometry(4,3),
    concrete
)
leftWall.rotation.y = Math.PI / 2
leftWall.position.set(0,1.5,2)
leftWall.receiveShadow = true
// Floor
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(5, 4),
    new THREE.MeshStandardMaterial({
        map: floorColor,
        roughnessMap: floorRough,
        aoMap: floorAom,
        aoMapIntensity: 1,
        normalMap: floorNormal,
        // color: 0xffffff,
        // metalness: 1,
        roughness: 0
    })
)
// floor.geometry.setAttribute('uv2', new THREE.BufferAttribute(floor.geometry.attributes.uv.array, 2))
floor.rotation.x = - Math.PI / 2
floor.position.set(2.5,0,2)
floor.receiveShadow = true


room.add(frontWall, leftWall, floor)

// Desk
const desk = new THREE.Object3D()
desk.position.set(2.5,.001,.401)
const deskMaterial = new THREE.MeshStandardMaterial({
    color: 0xdddddd,
    roughness: 0,
})
const deskTop = new THREE.Mesh(
    new THREE.BoxGeometry(1.9,.04,.8),
    deskMaterial
)
deskTop.position.y = .7
deskTop.castShadow = true
deskTop.receiveShadow = true
console.log(deskTop);
const deskSideGeometry = new THREE.BoxGeometry(.68,.04,.8)
const deskSideLeft = new THREE.Mesh(
    deskSideGeometry,
    deskMaterial
)
deskSideLeft.rotation.z = Math.PI / 2
deskSideLeft.position.set(-.93,.34,0)
deskSideLeft.castShadow = true
deskSideLeft.receiveShadow = true
const deskSideRight = new THREE.Mesh(
    deskSideGeometry,
    deskMaterial
)
deskSideRight.rotation.z = Math.PI / 2
deskSideRight.position.set(.93032,.34,0)
deskSideRight.castShadow = true
deskSideRight.receiveShadow = true
desk.add(deskTop, deskSideLeft, deskSideRight)

room.add(desk)
/*----End objects----*/

/*----Debug----*/
// Axes helper
const axesHelper = new THREE.AxesHelper()
scene.add(axesHelper)

gui.add(concrete, 'roughness').name("concrete_roughness").min(0).max(1).step(.001)
gui.add(ambientLight, 'intensity').name("ambientLight_intensity").min(0).max(1).step(.001)
gui.add(deskSideLeft.position, 'x').min(-.94).max(-.92).step(.00001)

// Sizes
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}
window.addEventListener('resize', () => {
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
camera.position.set(2,1,1.7)
// camera.lookAt(desk.position)
scene.add(camera)

// Renderer
const canvas = document.querySelector('.webgl')
const renderer = new THREE.WebGLRenderer({
    canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
// renderer.setPixelRatio(5)
renderer.setClearColor(0xeeeeee)
renderer.shadowMap.enabled = true

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
controls.target = new THREE.Vector3(2.5,1,-1)

const tick = () => {
    
    controls.update()
    renderer.render(scene, camera)
    window.requestAnimationFrame(tick)
}
tick()