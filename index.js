import * as THREE from 'three'
import { OrbitControls } from 'orbit'
import { LineMaterial } from 'lineMaterial'
import { GLTFLoader } from 'gltf-loader'
import { FlukeDevice } from './app/FlukeDevice.js'

const ENABLE_ORBIT = false
const MODEL_PATH = 'Fluke.glb'
window.onload = () =>
{
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0.9, 0.9, 0.9)
    const camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 0.1, 1000)
    camera.position.set(0, 0.05, 0.5)
    const hemiLight = new THREE.HemisphereLight('#ffffff', '#000000', 6)
    scene.add(hemiLight)
    const directLight = new THREE.DirectionalLight('#ffffff', 1)
    directLight.position.set(0, 0.05, 0.5)
    const directLightTarget = new THREE.Object3D()
    directLightTarget.position.set(0, 0.5, 0)
    scene.add(directLightTarget)
    directLight.target = directLightTarget
    scene.add(directLight)
    let canvas = document.querySelector('canvas')
    const renderer = new THREE.WebGLRenderer({canvas: canvas, antialias: true})
    renderer.setPixelRatio(2)
    const controls = new OrbitControls(camera, renderer.domElement )
    controls.target = new THREE.Vector3(0, 0.05, 0)
    controls.update()
    controls.enablePan = false
    controls.enableRotate = ENABLE_ORBIT
    controls.enableZoom = false

    let fluke = new FlukeDevice()
    let gltfLoader = new GLTFLoader()
    gltfLoader.load(MODEL_PATH, model=>{
        scene.add(model.scene)
        fluke.setModel(model.scene)
    }, p=>{}, e=>{})

    let raycaster = new THREE.Raycaster();
    let mouseHold = false
    let meshName = ''
    let cursor = new THREE.Vector2()
    let sliderRotAngle = 0
    canvas.addEventListener('mousedown', e=>{
        mouseHold = true
        cursor.x = e.clientX
        cursor.y = e.clientY
        let intersects = rayCast(e.clientX, e.clientY)
        meshName = intersects[0].object.name
        fluke.onSelect(meshName)
    })

    canvas.addEventListener('mousemove', e=>{
        if (mouseHold)
        {
            fluke.rotateSlider(sliderRotAngle+=5)
            cursor.x = e.clientX
            cursor.y = e.clientY
        }
    })

    canvas.addEventListener('mouseup', e=>{
        sliderRotAngle = 0
        mouseHold = false
        fluke.unselectSlider()
        let intersects = rayCast(e.clientX, e.clientY)
        if (intersects.length > 0)
        {
            meshName = intersects[0].object.name
            fluke.onSelect(meshName)
        }
    })

    animate()
    function animate() 
    {
        requestAnimationFrame(animate)
        camera.aspect = window.innerWidth/window.innerHeight
        camera.updateProjectionMatrix()
        renderer.setSize(window.innerWidth, window.innerHeight)
        renderer.render(scene, camera)
        controls.update()
        directLight.position.set(camera.position.x, camera.position.y, camera.position.z)
        directLight.lookAt(new THREE.Vector3())
    }

    function rayCast(x,y)
    {
        let ndcX = (x/window.innerWidth) * 2 - 1;
        let ndcY = -(y/window.innerHeight) * 2 + 1;
        raycaster.setFromCamera(new THREE.Vector2(ndcX, ndcY), camera)
        return raycaster.intersectObjects(scene.children) 
    }
}