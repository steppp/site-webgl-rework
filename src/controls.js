import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import configuration from "./configuration"

const buildControls = ({ camera, canvasElement }) => {
    const controls = new OrbitControls(camera, canvasElement)
    controls.enableDamping = true
    controls.enabled = configuration.scene.controls.enabled;

    return controls;
}

const controls = {
    buildControls
}

export default controls