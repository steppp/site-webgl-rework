
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight     
}

const windowResizeHandler = () => {
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight
}

// TODO: move all the event listeners into a dedicated module
window.addEventListener('resize', windowResizeHandler)

const sizeManager = (() => {
    return {
        sizes,
        setWindowResizeCallback: (callback) => {
            window.removeEventListener('resize', windowResizeHandler)
            windowResizeHandler = callback
            window.addEventListener('resize', windowResizeHandler)
        }
    }
})();

export default sizeManager;