import Vue from 'vue'
const selt = Vue.prototype
//  企业上报职责列表
export function getEnterpriseReportedList (officialDocId) {
  return selt.request({
    url: `/api/resp/content/getEnterpriseReportedList/${officialDocId}`,
    method: 'get'
  })
}


//查询当前版本
export function currentVersion (data) {
  return selt.request({
    url: `/api/resp/officialDoc/currentVersion`,
    method: 'post',
    data
  })
}



//获取履职内容详情
export function getContentInfo (id) {
  return selt.request({
    url: `/api/resp/content/getInfo/${id}`,
    method: 'post',
  })
}


//  通过orgId获取安全第一责任人信息
export function getByOrgId (orgId) {
  return selt.request({
    url: `/api/resp/firstResponsiblePerson/getByOrgId/${orgId}`,
    method: 'get'
  })
}
//主动上报
export function taskReport (data) {
  return selt.request({
    url: `/api/resp/task/report`,
    method: 'post',
    data
  })
}
//撤回任务重新上报
export function reportAgain (data) {
  return selt.request({
    url: `/api/resp/task/reportAgain`,
    method: 'post',
    data
  })
}