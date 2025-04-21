import { MathUtils } from "three"

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
                this.meshes.set('Screen', m)
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
        else if (meshName == 'SliderButton')
        {
            this.isSliderSelected = true
        }
    }

    rotateSlider(angle)
    {
        if (this.isSliderSelected)
        {
            let slider = this.meshes.get('SliderButton')
            slider.rotation.y = MathUtils.degToRad(angle)
        }
    }

    unselectSlider() 
    { 
        this.isSliderSelected = false
        let slider = this.meshes.get('SliderButton')
        slider.rotation.y = 0 
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
}