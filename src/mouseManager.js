import { Vector2 } from "three"
import sizeManager from "./sizeManager"

const mousePos = new Vector2

let mouseMoveHandler = (mousePosition) => {}
let defaultMoveHandler = ev => {
    mousePos.x = ev.clientX / sizeManager.sizes.width * 2 - 1
    mousePos.y = - (ev.clientY / sizeManager.sizes.height) * 2 + 1

    mouseMoveHandler(mousePos)
}

const mouseManager = (() => {
    window.addEventListener('mousemove', defaultMoveHandler)

    return {
        mousePos,
        setMouseMoveCallback: (callback) => {
            mouseMoveHandler = callback;
        }
    }
})()

export default mouseManager