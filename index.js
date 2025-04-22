import * as THREE from 'three'
import { OrbitControls } from 'orbit'
import { LineMaterial } from 'lineMaterial'
import { GLTFLoader } from 'gltf-loader'
import { FlukeDevice } from './app/FlukeDevice.js'

const ENABLE_ORBIT = true
const MODEL_PATH = 'Fluke.glb'
window.onload = () =>
{
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0.9, 0.9, 0.9)
    const camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 0.1, 1000)
    camera.position.set(0, 0.05, 0.4)
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

    let hasModelLoaded = false
    let raycaster = new THREE.Raycaster();
    let mouseHold = false
    let meshName = ''
    let progressDots = 1
    let status = 0
    let isSliderSelected = false

    let loadingScreen = document.getElementById('loading-screen')
    let loadingText = document.getElementById('loading-text')

    let fluke = new FlukeDevice()
    let gltfLoader = new GLTFLoader()
    gltfLoader.load(MODEL_PATH, model=>{
        hasModelLoaded = true
        scene.add(model.scene)
        fluke.setModel(model.scene)
        document.body.removeChild(loadingScreen)
    }, p=>{
        status = (p.loaded/p.total) * 100
        status = Math.trunc(status)
        if (status > 100)
            status = 100
    }, e=>{})

    showProgress()

    canvas.addEventListener('mousedown', e=>{
        if (hasModelLoaded)
        {
            mouseHold = true
            let intersects = rayCast(e.clientX, e.clientY)
            if (intersects.length > 0)
            {
                meshName = intersects[0].object.name
                isSliderSelected = fluke.onSelectSlider(meshName)
                if (isSliderSelected)
                    controls.enableRotate = false
            }
        }
    })

    canvas.addEventListener('mousemove', e=>{
        if (hasModelLoaded && mouseHold && isSliderSelected)
            fluke.rotateSlider(e.clientX, e.clientY)
    })

    canvas.addEventListener('mouseup', e=>{
        if (hasModelLoaded)
        {
            mouseHold = false
            if (isSliderSelected)
            {    
                fluke.unselectSlider()
                controls.enableRotate = ENABLE_ORBIT
            }
            let intersects = rayCast(e.clientX, e.clientY)
            if (intersects.length > 0)
            {
                meshName = intersects[0].object.name
                fluke.onSelect(meshName)
            }
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
        fluke.updateSliderRasterPosition(camera)
    }

    function rayCast(x,y)
    {
        let ndcX = (x/window.innerWidth) * 2 - 1;
        let ndcY = -(y/window.innerHeight) * 2 + 1;
        raycaster.setFromCamera(new THREE.Vector2(ndcX, ndcY), camera)
        return raycaster.intersectObjects(scene.children) 
    }

    function showProgress()
    {
        if (!hasModelLoaded)
        {
            setTimeout(()=>{
                let dots = ''
                for (let i=0; i<progressDots; i++)
                    dots += '.'
                progressDots++
                if (progressDots > 3)
                    progressDots = 1
                loadingText.innerText = 'LOADING'+dots+' '+status+'%'
                showProgress()
            }, 100)
        }
    }
}