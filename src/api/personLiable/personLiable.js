import Vue from 'vue'
const selt = Vue.prototype

// 首次认证查询 
export function checkAuth () {
  return selt.request({
    url: `/api/resp/firstResponsiblePerson/checkAuth`,
    method: 'get'
  })
}

// 认证详情 
export function authDetail (id) {
  return selt.request({
    url: `/api/resp/firstResponsiblePerson/get/${id}`,
    method: 'get'
  })
}

// 新增安全第一责任人 
export function add (data) {
  return selt.request({
    url: `/api/resp/firstResponsiblePerson/add`,
    method: 'post',
    data
  })
}
// 修改安全第一责任人
export function edit (data) {
  return selt.request({
    url: `/api/resp/firstResponsiblePerson/edit`,
    method: 'post',
    data
  })
}

// 获取安全第一责任人详情 
export function getPerson (personId) {
  return selt.request({
    url: `/api/resp/firstResponsiblePerson/getPersonAndCertificateByPersonId/${personId}`,
    method: 'get',
  })
}
// 获取安全第一责任人详情 
export function getPerson2 (id) {
  return selt.request({
    url: `/api/resp/firstResponsiblePerson/get/${id}`,
    method: 'get',
  })
}