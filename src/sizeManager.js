
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight     
}

let windowResizeHandler = (sizes) => {}

let defaultWindowResizeHandler = () => {
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    windowResizeHandler(sizes)
}

// TODO: move all the event listeners into a dedicated module
window.addEventListener('resize', defaultWindowResizeHandler)

const sizeManager = (() => {
    return {
        sizes,
        setWindowResizeCallback: (callback) => {
            windowResizeHandler = callback
        }
    }
})()

export default sizeManager