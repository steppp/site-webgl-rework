import { AxesHelper } from "three"

const helpers = []

let onHelperAddedHandler = (helperObject) => {}

const baseHelperAddedHandler = (helperObject) => {
    helpers.push(helperObject)

    onHelperAddedHandler?.call(this, helperObject, helpers)
}

const addAxesHelper = (scene, {size, enabled}) => {
    size ??= 1

    const axesHelper = new AxesHelper(size)
    axesHelper.visible = enabled

    scene.add(axesHelper)
    baseHelperAddedHandler(axesHelper)
}

const helpersManager = (() => {
    return {
        addAxesHelper,
        setHelperAddedCallback: (callback) => {
            onHelperAddedHandler = callback
        }
    }
})()

export default helpersManager