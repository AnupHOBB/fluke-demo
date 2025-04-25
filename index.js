import * as THREE from 'three'
import { OrbitControls } from 'orbit'
import { LineMaterial } from 'lineMaterial'
import { GLTFLoader } from 'gltf-loader'
import { FlukeDevice } from './app/FlukeDevice.js'

const ENABLE_ORBIT = true
const MODEL_PATH = 'Fluke.glb'
const SLIDER_IMAGE_PATHS = ['sliderscreens/0.png', 'sliderscreens/1.png', 'sliderscreens/2.png', 'sliderscreens/3.png', 'sliderscreens/4.png', 'sliderscreens/5.png', 'sliderscreens/6.png', 'sliderscreens/7.png', 'sliderscreens/8.png', 'sliderscreens/9.png', 'sliderscreens/10.png', 'sliderscreens/11.png', 'sliderscreens/12.png']
const SLIDER_TEXTURES = []
const SLIDER_FUNCTION_PATHS = ['sliderfunctions/0.png', 'sliderfunctions/1.png', 'sliderfunctions/2.png', 'sliderfunctions/3.png']
const SLIDER_FUNCTION_TEXTURES = []

window.onload = () =>
{
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0.9, 0.9, 0.9)
    const camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 0.1, 1000)
    camera.position.set(0.01, 0.05, 0.4)
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
    let hasMouseMoved = false

    let loadingScreen = document.getElementById('loading-screen')
    let loadingText = document.getElementById('loading-text')

    let fluke = new FlukeDevice()
    let gltfLoader = new GLTFLoader()
    gltfLoader.load(MODEL_PATH, model=>{
        hasModelLoaded = true
        scene.add(model.scene)
        fluke.setModel(model.scene)
        loadTextures(0)
    }, p=>{
        status = (p.loaded/p.total) * 50
        status = Math.trunc(status)
        if (status > 50)
            status = 50
    }, e=>{})


    showProgress()

    canvas.addEventListener('mousedown', e=>{
        if (hasModelLoaded)
        {
            mouseHold = true
            hasMouseMoved = false
            let intersects = rayCast(e.clientX, e.clientY)
            if (intersects.length > 0)
            {
                meshName = intersects[0].object.name
                isSliderSelected = fluke.onSelectSlider(meshName, e.clientX, e.clientY)
                if (isSliderSelected)
                    controls.enableRotate = false
            }
        }
    })

    canvas.addEventListener('mousemove', e=>{
        if (hasModelLoaded && mouseHold && isSliderSelected)
        {
            hasMouseMoved = true   
            fluke.rotateSlider(e.clientX, e.clientY)
        }
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
                if (!hasMouseMoved)
                    fluke.onClickedSlider(meshName)
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

    function loadTextures(index)
    {
        if (index >= 0 && index < SLIDER_IMAGE_PATHS.length)
        {
            new THREE.TextureLoader().load(SLIDER_IMAGE_PATHS[index], t => {
                SLIDER_TEXTURES.push(t)
                status = Math.trunc(50 + (((index+1)/SLIDER_IMAGE_PATHS.length) * 40))
                if (status > 90)
                    status = 90
                loadTextures(++index)
            })
        }
        else
        {
            status = 90
            fluke.setSliderTextures(SLIDER_TEXTURES)
            loadFunctionTextures(0)
        }
    }

    function loadFunctionTextures(index)
    {
        if (index >= 0 && index < SLIDER_FUNCTION_PATHS.length)
        {
            new THREE.TextureLoader().load(SLIDER_FUNCTION_PATHS[index], t => {
                SLIDER_FUNCTION_TEXTURES.push(t)
                status = Math.trunc(90 + (((index+1)/SLIDER_FUNCTION_PATHS.length) * 10))
                if (status > 100)
                    status = 100
                loadFunctionTextures(++index)
            })
        }
        else
        {
            status = 100
            fluke.setSliderFunctionTextures(SLIDER_FUNCTION_TEXTURES)
            document.body.removeChild(loadingScreen)
        }
    }
}