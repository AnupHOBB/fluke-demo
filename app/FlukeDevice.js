import * as THREE from 'three'

export class FlukeDevice
{
    constructor() 
    { 
        this.meshes = new Map()
        this.isSliderSelected = false
        this.powerOn = false
        this.turningOn = false
        this.playingVideo = false
        this.sliderRasterPosition = new THREE.Vector2()
        this.sliderRasterUp = new THREE.Vector3(0, -1)
        this.previousPointer = new THREE.Vector2()
        this.selectedSliderImageIndex = 0
        this.isSliderFunctionMenuOpen = false
        this.baseAngleInDegrees = 0
        this.lastAngleInDegrees = 0
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
                let blackScreenMaterial = new THREE.MeshStandardMaterial({color: new THREE.Color(0,0,0)})
                m.material = blackScreenMaterial
            }
        })
    }

    setSliderTextures(sliderTextures) 
    { 
        this.sliderTextures = sliderTextures
        if (this.sliderTextures.length > 0)
        {
            for (let texture of this.sliderTextures)
            {
                texture.flipY = false
                texture.offset.set(-0.02, -0.65);
                texture.repeat.set(1.025, 1.675);
            }
            this.defaultScreenMaterial = new THREE.MeshBasicMaterial({map: this.sliderTextures[0]})
        }
    }

    setSliderFunctionTextures(sliderFunctionTextures) 
    { 
        this.sliderFunctionTextures = sliderFunctionTextures
        if (this.sliderFunctionTextures.length > 0)
        {
            for (let texture of this.sliderFunctionTextures)
            {
                texture.flipY = false
                texture.offset.set(-0.02, -0.65);
                texture.repeat.set(1.025, 1.675);
            }
        }
    }

    onButtonHold(meshName)
    {
        if (meshName == 'MenuButton')
        {
            let menuButton = this.meshes.get('MenuButton')
            menuButton.position.z -= 0.002
            this.selectedMesh = menuButton
        }
        else if (meshName == 'AlertButton')
        {
            let alertButton = this.meshes.get('AlertButton')
            alertButton.position.z -= 0.002
            this.selectedMesh = alertButton
        }
        else if (meshName == 'PowerButton')
        {
            let powerButton = this.meshes.get('PowerButton')
            powerButton.position.z -= 0.002
            this.selectedMesh = powerButton
        }
        else if (meshName == 'FunctionsButton')
        {
            let functionsButton = this.meshes.get('FunctionsButton')
            functionsButton.position.z -= 0.002
            this.selectedMesh = functionsButton
        }
        else if (meshName == 'MeasureFormButton')
        {
            let measureFormButton = this.meshes.get('MeasureFormButton')
            measureFormButton.position.z -= 0.002
            this.selectedMesh = measureFormButton
        }
        else if (meshName == 'WifiButton')
        {
            let wifiButton = this.meshes.get('WifiButton')
            wifiButton.position.z -= 0.002
            this.selectedMesh = wifiButton
        }
        else if (meshName == 'SaveButton')
        {
            let saveButton = this.meshes.get('SaveButton')
            saveButton.position.z -= 0.002
            this.selectedMesh = saveButton
        }
        else if (meshName == 'TestButton')
        {
            let testButton = this.meshes.get('TestButton')
            testButton.position.z -= 0.002
            this.selectedMesh = testButton
        }
        else if (meshName == 'SliderButton')
        {
            let slider = this.meshes.get('SliderButton')
            slider.position.z -= 0.005
            this.selectedMesh = slider
        }
    }

    onButtonRelease()
    {
        if (this.selectedMesh != null)
        {
            if (this.selectedMesh.name == 'SliderButtonParent')
                this.selectedMesh.position.z += 0.005
            else
                this.selectedMesh.position.z += 0.002
            this.selectedMesh = null
        }
    }

    onSelect(meshName)
    {
        if (meshName == 'MenuButton')
        {
            if (this.powerOn && !this.playingVideo)
            {
                
            }
        }
        else if (meshName == 'AlertButton')
        {
            if (this.powerOn && !this.playingVideo)
            {
                
            }
        }
        else if (meshName == 'PowerButton')
        {
            if (!this.powerOn && !this.turningOn)
            {
                this.turningOn = true
                let powerButton = this.meshes.get('PowerButton')
                powerButton.material.color = new THREE.Color(0/255, 255/255, 0/255) 
                let screen = this.meshes.get('Screen')
                this.defaultScreenMaterial.map = this.sliderTextures[0]
                this.selectedSliderImageIndex = 0
                this.lastAngleInDegrees = 0
                this._applyMaterial(screen, this.defaultScreenMaterial)
                this.powerOn = true
                this.turningOn = false
            }
            else if (!this.turningOn)
            {
                this.powerOn = false
                let blackScreenMaterial = new THREE.MeshStandardMaterial({color: new THREE.Color(0,0,0)})
                let screen = this.meshes.get('Screen')
                this._applyMaterial(screen, blackScreenMaterial) 
                let powerButton = this.meshes.get('PowerButton')
                powerButton.material.color = new THREE.Color(1,1,1)
            }
        }
        else if (meshName == 'FunctionsButton')
        {
            if (this.powerOn && !this.playingVideo)
            {
                
            }
        }
        else if (meshName == 'MeasureFormButton')
        {
            if (this.powerOn && !this.playingVideo)
            {
                
            }
        }
        else if (meshName == 'WifiButton')
        {
            if (this.powerOn && !this.playingVideo)
            {
                
            }
        }
        else if (meshName == 'SaveButton')
        {
            if (this.powerOn && !this.playingVideo)
            {
                let video = document.createElement('video')
                video.src = 'save.mp4'
                video.autoplay = true
                video.addEventListener('ended', e=>{
                    if (this.powerOn)
                    {
                        let screen = this.meshes.get('Screen')
                        if (this.isSliderFunctionMenuOpen)
                        {
                            this.isSliderFunctionMenuOpen = false
                            this.defaultScreenMaterial.map = this.sliderTextures[this.selectedSliderImageIndex]
                        }
                        this._applyMaterial(screen, this.defaultScreenMaterial)
                        this.playingVideo = false
                    }
                })
                let screenTextureVideoTexture = new THREE.VideoTexture(video)
                screenTextureVideoTexture.flipY = false
                screenTextureVideoTexture.offset.set(-0.02, -0.65);
                screenTextureVideoTexture.repeat.set(1.025, 1.675);
                let screen = this.meshes.get('Screen')
                let videoMaterial = new THREE.MeshBasicMaterial({map: screenTextureVideoTexture})
                this._applyMaterial(screen, videoMaterial)
                this.playingVideo = true
            }
        }
        else if (meshName == 'TestButton')
        {
            if (this.powerOn && !this.playingVideo)
            {

            }
        }
    }

    onSelectSlider(meshName, x, y)
    {
        if (meshName == 'SliderButton')
        {
            this.isSliderSelected = true
            if (this.powerOn && !this.playingVideo)
            {    
                this.previousPointer = new THREE.Vector2(x, y)
                let angle = this._getRotationAngleForSlider(x, y)
                let degree = Math.round(THREE.MathUtils.radToDeg(-angle))
                if (degree < 0)
                    degree = 360 + degree
                let roundedDegree = Math.trunc(degree/27.7) * 27.7
                this.baseAngleInDegrees = roundedDegree
            }
            return true
        }
        return false
    }

    onClickedSlider(meshName)
    {
        if (this.powerOn && !this.playingVideo && meshName == 'SliderButton')
        {
            if (this.isSliderFunctionMenuOpen)
            {
                let screen = this.meshes.get('Screen')
                screen.material.map = this.sliderTextures[this.selectedSliderImageIndex]
                this.isSliderFunctionMenuOpen = false
            }
            else if (this.selectedSliderImageIndex < this.sliderFunctionTextures.length)
            {
                let screen = this.meshes.get('Screen')
                screen.material.map = this.sliderFunctionTextures[this.selectedSliderImageIndex]
                this.isSliderFunctionMenuOpen = true
            }
        }
    }

    rotateSlider(x, y)
    {
        if (this.isSliderSelected)
        { 
            let slider = this.meshes.get('SliderButton')
            let angle = this._getRotationAngleForSlider(x, y)
            slider.rotation.z = angle
            if (this.powerOn && !this.playingVideo)
            {
                let degree = Math.round(THREE.MathUtils.radToDeg(-angle))
                if (degree < 0)
                    degree = 360 + degree        
                degree += this.lastAngleInDegrees - this.baseAngleInDegrees
                if (degree < 0)
                    degree = 360 + degree
                else if (degree > 360)
                    degree = degree - 360
                let roundedDegree = Math.trunc(degree/27.7) * 27.7  
                let index = Math.trunc(roundedDegree/27.7)
                let screen = this.meshes.get('Screen')
                screen.material.map = this.sliderTextures[index]
                this.defaultScreenMaterial.map = this.sliderTextures[index]
                this.selectedSliderImageIndex = index
            }
            this.previousPointer = new THREE.Vector2(x, y)
        }
    }

    unselectSlider() 
    { 
        if (this.isSliderSelected)
        {
            this.isSliderSelected = false
            if (this.powerOn && !this.playingVideo)
                this.lastAngleInDegrees = this.selectedSliderImageIndex * 27.7
        }
    }

    updateSliderRasterPosition(camera)
    {
        let slider = this.meshes.get('SliderButton')
        if (slider != undefined)
        {
            let worldPoint = new THREE.Vector3()
            slider.getWorldPosition(worldPoint)
            worldPoint.project(camera)
            this.sliderRasterPosition.x = ((worldPoint.x + 1)/2) * window.innerWidth
            this.sliderRasterPosition.y = ((1 - worldPoint.y)/2) * window.innerHeight
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

    _getRotationAngleForSlider(x, y)
    {
        let pointer = new THREE.Vector2(x, y)
        let center2Pointer = new THREE.Vector2(pointer.x - this.sliderRasterPosition.x, pointer.y - this.sliderRasterPosition.y)
        let center2PointerLengthSquared = ((this.sliderRasterPosition.x - pointer.x) * (this.sliderRasterPosition.x - pointer.x)) + ((this.sliderRasterPosition.y - pointer.y) * (this.sliderRasterPosition.y - pointer.y))
        let center2PointerLength = Math.sqrt(center2PointerLengthSquared)
        center2Pointer.x /= center2PointerLength
        center2Pointer.y /= center2PointerLength
        let dot = (center2Pointer.x * this.sliderRasterUp.x) + (center2Pointer.y * this.sliderRasterUp.y)
        let angle = Math.acos(dot)
        if (x >= this.sliderRasterPosition.x)
            angle = -angle
        return angle
    }
}