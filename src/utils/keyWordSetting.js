// diy插件关键字工具函数文件
import { getStorgeByID } from '@/utils/uTools'
import { diyStoreKey } from '@/const'
import { isObject } from '@/utils/index'
/**
 * @description 处理插件的features列表
 * @param { Array } 插件的features
 * @return { Array } features里关键字列表
*/
export function disposeFeatures(features) {
  const featurelist = []
  features.forEach(feature => {
    // const list = feature.cmds.map(cmdItem => {
    //   return isObject(cmdItem) ? cmdItem.label : cmdItem
    // })
    const list = feature.cmds.filter(cmdItem => {
      return !isObject(cmdItem)
    })
    featurelist.push(...list)
  })
  return featurelist
}

/**
 * @description 获取插件id（name）
 * @param {String} 当前功能关的code
 * @return { String } id
*/
export function getPluginsId(code) {
  if(!code || typeof code !== 'string') return
  return code.split('_')[0]
}

/**
 * @description 根据插件id获取当前本地存储的数据
*/
export function getStoreDataById(id) {
  const _id = diyStoreKey + '_' + id
  const storeData = getStorgeByID(_id)
  return storeData
}

/**
 * @description 根据插件信息和diy关键词获取目标关键词
 * @param {Object} 插件信息
 * @param {String} diy关键词
 * @return {String | Object} 目标关键词
*/
export function getTargetKeyWOrdByPlugsData(pluginsData, diyKeyWord) {
  const diyList = pluginsData.diyList
  const features = pluginsData.features
  const findItem = diyList.find(item => item.diyKeyWord === diyKeyWord)
  const targetKeyWord = findItem ? findItem.targetKeyWord : ''
  // 根据目标关键字获取插件feature里的数据
  let resCmd = ''
   features.some(feature => {
    resCmd = feature.cmds.find(cmdItem => {
      return isObject(cmdItem) ? targetKeyWord === cmdItem.label : targetKeyWord === cmdItem
    })       
    return resCmd
  })
  return resCmd
}

/**
 * @description 根据已配置插件，过滤未配置插件
 * @param {Array} 已配置插件
 * @param {Array} 未配置插件
 * @return {Array} 过滤完成的数组
*/
export function filterNoSetting(alreadySettingList, notSettingList) {
  return notSettingList.filter(noPulins => {
    const findRes = alreadySettingList.find(okPluins => okPluins.name === noPulins.name)
    return !findRes
  })
}

/**
 * @description 根据插件id筛选插件的feature
 * @param {Array} 所有的feature
 * @param {String} 插件id
 * @return {Array} 筛选后的feature
*/
export function filterFetureById(featureList, id) {
  if(Array.isArray(featureList)) {
    return featureList.filter(feature => {
      return feature.code.split('_')[0] === id
    })
  } else {
    return []
  }
}

/**
 * @description 生成添加到feature里的参数
 * @param {Object} 插件信息
 * @param { Object } diy信息
 * @return {Object} 生成的信息
*/
export function generateFeatureParams(pluinsData, diyData) {
  return {
    code: pluinsData.name + '_' + diyData.diyKeyWord, // 当前插件name + diy关键字
    explain: `前往插件：${pluinsData.pluginName}, 目标关键字：${diyData.targetKeyWord}`,
    icon: pluinsData.logoPath,
    cmds: [diyData.diyKeyWord]
  }
}