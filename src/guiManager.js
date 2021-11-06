import * as dat from 'dat.gui'

let gui = null
let mainConfig = null

const existingFolders = {}

const createFolders = (folderNames) => {
    folderNames.forEach?.call(folderNames, (folderName) => {
        const folder = gui.addFolder(folderName)
        existingFolders[folderName] = folder
    })
}

const getBuiltFolder = (folderName) => {
    const targetFolder = existingFolders[folderName]
    if (!targetFolder) {
        targetFolder = gui.addFolder(folderName)
        existingFolders[folderName] = targetFolder
    }

    return targetFolder
}

const addSceneBackgroundGui = ({scene, folderName}) => {
    const targetFolder = getBuiltFolder(folderName)
    
    targetFolder.addColor(mainConfig.scene, 'background')
        .onChange(_ => scene.background.set(mainConfig.scene.background))
}

const addObjectVisibilityGui = ({targetObj, folderName, objectConfig}) => {
    const targetFolder = getBuiltFolder(folderName)

    // TODO: make this even more generic and pass the property name as a param?
    targetFolder.add(objectConfig, 'visible')
        .name(`${objectConfig.guiName} visible`)
        .onFinishChange(_ => targetObj.visible = objectConfig.visible)
}

const guiManager = ((initOptions) => {
    gui = new dat.GUI(initOptions)

    return {
        mainConfig,
        createFolders,
        addSceneBackgroundGui,
        addObjectVisibilityGui
    }
})()

export default guiManager