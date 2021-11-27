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

const addPropertyGui = ({targetObj, targetProp, folderName, objectConfig}) => {
    const targetFolder = getBuiltFolder(folderName)

    targetFolder.add(objectConfig, targetProp)
        .name(`${objectConfig.guiName} ${targetProp}`)
        .onFinishChange(_ => targetObj[targetProp] = objectConfig[targetProp])
}

const addActionGui = ({targetObj, targetFuncName, folderName}) => {
    const targetFolder = getBuiltFolder(folderName)

    targetFolder.add(targetObj, targetFuncName);
}

const guiManager = ((initOptions) => {
    gui = new dat.GUI(initOptions)

    return {
        mainConfig,
        createFolders,
        addSceneBackgroundGui,
        addPropertyGui,
        addActionGui
    }
})()

export default guiManager