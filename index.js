import * as THREE from 'three'
import { OrbitControls } from 'orbit'
import { LineMaterial } from 'lineMaterial'
import { GLTFLoader } from 'gltf-loader'

const MODEL_PATH = 'Fluke.glb'
window.onload = () =>
{
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0.9, 0.9, 0.9)
    const camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 0.1, 1000)
    camera.position.set(0, 0.05, 0.5)
    const hemiLight = new THREE.HemisphereLight('#ffffff', '#000000', 5)
    scene.add(hemiLight)
    const directLight = new THREE.DirectionalLight('#ffffff', 1)
    directLight.position.set(0, 0.05, 0.5)
    scene.add(directLight)
    const renderer = new THREE.WebGLRenderer({canvas: document.querySelector('canvas'), antialias: true})
    const controls = new OrbitControls(camera, renderer.domElement )
    controls.target = new THREE.Vector3(0, 0.05, 0)
    let gltfLoader = new GLTFLoader()
    gltfLoader.load(MODEL_PATH, model=>{
        scene.add(model.scene)
    }, p=>{}, e=>{})
    console.log(camera)
    animate()

    function animate() 
    {
        requestAnimationFrame(animate)
        controls.update()
        camera.aspect = window.innerWidth/window.innerHeight
        camera.updateProjectionMatrix()
        renderer.setSize(window.innerWidth, window.innerHeight)
        renderer.render(scene, camera)
        directLight.position.set(camera.position.x, camera.position.y, camera.position.z)
        directLight.lookAt(new THREE.Vector3())
    }
}