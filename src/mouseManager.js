
const mousePos = new THREE.Vector2()

let mouseMoveHandler = ev => {
    mousePos.x = ev.clientX / sizes.width * 2 - 1
    mousePos.y = - (ev.clientY / sizes.height) * 2 + 1
}

const mouseManager = (() => {
    return {
        mousePos,
        setMouseMoveCallback: (callback) => {
            window.removeEventListener('mousemove', mouseMoveHandler)
            mouseMoveHandler = callback;
            window.addEventListener('mousemove', mouseMoveHandler)
        }
    }
})()

export default mouseManager