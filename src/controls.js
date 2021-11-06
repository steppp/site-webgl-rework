import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"

const buildControls = ({ camera, canvasElement }) => {
    const controls = new OrbitControls(camera, canvasElement)
    controls.enableDamping = true

    return controls;
}

const controls = {
    buildControls
}

export default controls