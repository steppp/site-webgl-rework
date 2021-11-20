import { Vector2 } from "three"
import sizeManager from "./sizeManager"

const mousePos = new Vector2

let mouseMoveHandlers = []
let defaultMoveHandler = ev => {
    mousePos.x = ev.clientX / sizeManager.sizes.width * 2 - 1
    mousePos.y = - (ev.clientY / sizeManager.sizes.height) * 2 + 1

    for (const handler of mouseMoveHandlers) {
        handler(mousePos)
    }
}

let mouseLeaveHandlers = []
let defaultLeaveHandler = ev => {
    // add default behavior

    for (const handler of mouseLeaveHandlers) {
        handler()
    }
}

const addCallbackToHandlersChain = (array, callback) => {
    if (callback && 'function' === typeof (callback)) {
        array.push(callback)
    }
}

let mouseEnterHandlers = []
let defaultEnterHandler = ev => {
    // add default behavior

    for (const handler of mouseEnterHandlers) {
        handler(mousePos)
    }
}

const mouseManager = (() => {
    document.body.addEventListener('mousemove', defaultMoveHandler)
    document.body.addEventListener('mouseleave', defaultLeaveHandler)
    document.body.addEventListener('mouseover', defaultEnterHandler)

    return {
        mousePos,
        addMouseMoveCallback: (handler) =>
            addCallbackToHandlersChain(mouseMoveHandlers, handler),
        addMouseLeaveCallback: (handler) =>
            addCallbackToHandlersChain(mouseLeaveHandlers, handler),
        addMouseEnterCallback: (handler) =>
            addCallbackToHandlersChain(mouseEnterHandlers, handler)
    }
})()

export default mouseManager