import * as THREE from 'three'

export class FlukeDevice
{
    constructor() 
    { 
        this.meshes = new Map()
        this.isSliderSelected = false
    }

    setModel(model)
    {
        this._traverse(model, m => {
            if (m.name == 'MenuButton')
                this.meshes.set('MenuButton', m)
            else if (m.name == 'AlertButton')
                this.meshes.set('AlertButton', m)
            else if (m.name == 'PowerButton')
                this.meshes.set('PowerButton', m)
            else if (m.name == 'FunctionsButton')
                this.meshes.set('FunctionsButton', m)
            else if (m.name == 'MeasureFormButton')
                this.meshes.set('MeasureFormButton', m)
            else if (m.name == 'WifiButton')
                this.meshes.set('WifiButton', m)
            else if (m.name == 'SaveButton')
                this.meshes.set('SaveButton', m)
            else if (m.name == 'TestButton')
                this.meshes.set('TestButton', m)
            else if (m.name == 'SliderButtonParent')
                this.meshes.set('SliderButton', m)
            else if (m.name == 'Screen')
            {    
                this.meshes.set('Screen', m)
                this.defaultScreenMaterial = m.material
            }
        })
    }

    onSelect(meshName)
    {
        if (meshName == 'MenuButton')
        {

        }
        else if (meshName == 'AlertButton')
        {

        }
        else if (meshName == 'PowerButton')
        {
            let video = document.createElement('video')
            video.src = 'save.mp4'
            video.autoplay = true
            video.addEventListener('ended', e=>{
                let screen = this.meshes.get('Screen')
                this._applyMaterial(screen, this.defaultScreenMaterial)
            })
            let screenTextureVideoTexture = new THREE.VideoTexture(video)
            screenTextureVideoTexture.flipY = false
            screenTextureVideoTexture.offset.set(-0.02, -0.65);
            screenTextureVideoTexture.repeat.set(1.025, 1.675);
            let screen = this.meshes.get('Screen')
            let videoMaterial = new THREE.MeshBasicMaterial({map: screenTextureVideoTexture})
            this._applyMaterial(screen, videoMaterial)
        }
        else if (meshName == 'FunctionsButton')
        {

        }
        else if (meshName == 'MeasureFormButton')
        {

        }
        else if (meshName == 'WifiButton')
        {

        }
        else if (meshName == 'SaveButton')
        {

        }
        else if (meshName == 'TestButton')
        {

        }
    }

    onSelectSlider(meshName)
    {
        if (meshName == 'SliderButton')
        {
            this.isSliderSelected = true
            let video = document.createElement('video')
            video.src = 'save.mp4'
            video.autoplay = true
            video.loop = true
            let screenTextureVideoTexture = new THREE.VideoTexture(video)
            screenTextureVideoTexture.flipY = false
            screenTextureVideoTexture.offset.set(-0.02, -0.65);
            screenTextureVideoTexture.repeat.set(1.025, 1.675);
            let screen = this.meshes.get('Screen')
            let videoMaterial = new THREE.MeshBasicMaterial({map: screenTextureVideoTexture})
            this._applyMaterial(screen, videoMaterial)
        }
    }

    rotateSlider(angle)
    {
        if (this.isSliderSelected)
        {
            let slider = this.meshes.get('SliderButton')
            slider.rotation.y = THREE.MathUtils.degToRad(angle)
        }
    }

    unselectSlider() 
    { 
        if (this.isSliderSelected)
        {
            this.isSliderSelected = false
            let slider = this.meshes.get('SliderButton')
            slider.rotation.y = 0
            let screen = this.meshes.get('Screen')
            this._applyMaterial(screen, this.defaultScreenMaterial)
        }
    }

    _traverse(threeJsObject, onNodeReach, ...values)
    {
        if (threeJsObject.children.length > 0)
        {
            for (let i=0; i<threeJsObject.children.length; i++)   
                this._traverse(threeJsObject.children[i], onNodeReach, values)
        }
        onNodeReach(threeJsObject, values)
    }

    _applyMaterial(threeJsObject, material)
    {
        if (threeJsObject.isMesh)
            threeJsObject.material = material
        else if (threeJsObject.children.length > 0)
        {
            for (let i=0; i<threeJsObject.children.length; i++)   
                this._applyMaterial(threeJsObject.children[i], material)
        }
    }
}