import Vue from 'vue'
const selt = Vue.prototype


// 职责列表
export function treeByItemId (data) {
  return selt.request({
    url: `/api/resp/content/treeByItemId`,
    method: 'post',
    data
  })
}
// 批量新增/修改红头文件  
export function officialDocEdit (data) {
  return selt.request({
    url: `/api/resp/officialDoc/edit`,
    method: 'post',
    data
  })
}
// 新增履职项目  
export function itemAdd (data) {
  return selt.request({
    url: `/api/resp/item/add`,
    method: 'post',
    data
  })
}
// 版本列表  
export function officialDocList (data) {
  return selt.request({
    url: `/api/resp/officialDoc/listPage`,
    method: 'post',
    data
  })
}
// 新增履职内容  
export function contentAdd (data) {
  return selt.request({
    url: `/api/resp/content/add`,
    method: 'post',
    data
  })
}
// 删除履职内容  
export function removeContent (id) {
  return selt.request({
    url: `/api/resp/content/removeContent/${id}`,
    method: 'post'
  })
}
// 删除履职项目  
export function removeProject (id) {
  return selt.request({
    url: `/api/resp/item/removeItem/${id}`,
    method: 'post'
  })
}
// 删除红头文件 
export function removeofficialDoc (id) {
  return selt.request({
    url: `/api/resp/officialDoc/remove/${id}`,
    method: 'DELETE'
  })
}
// 修改履职项目  
export function projectEdit (data) {
  return selt.request({
    url: `/api/resp/item/edit`,
    method: 'post',
    data
  })
}
// 获取履职内容详情  
export function getInfoContent (id) {
  return selt.request({
    url: `/api/resp/content/getInfo/${id}`,
    method: 'post'
  })
}
// 修改履职内容  
export function editContent (data) {
  return selt.request({
    url: `/api/resp/content/edit`,
    method: 'post',
    data
  })
}

// 通过ID获取证书信息
export function getBct (id) {
  return selt.request({
    url: `/api/basedata/bct/get/${id}`,
    method: 'get'
  })
}
// 通过ID获取文件信息
export function getUdc (id) {
  return selt.request({
    url: `/api/sysudc/udc/get/${id}`,
    method: 'get'
  })
}
// 下发
export function distribute (id) {
  return selt.request({
    url: `/api/resp/content/distribute/${id}`,
    method: 'post'
  })
}

export function getUdcByCode (code) {
  return selt.request({
    url: `/api/sysudc/udc/typeCodeExpr/${code}`,
    method: 'post'
  })
}

export function getBctList (data) {
  return selt.request({
    url: `/api/basedata/bct/pageByExpr`,
    method: 'post',
    data
  })
}

export function getUdcList (data) {
  return selt.request({
    url: `/api/sysudc/udc/pageByQueryExpr`,
    method: 'post',
    data
  })
}
