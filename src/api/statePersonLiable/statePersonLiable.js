import Vue from 'vue'
const selt = Vue.prototype


// 单位信息
export function getOrgDetails (id) {
  return selt.request({
    url: `/api/system/sys_org_details/getByOrgId/${id}`,
    method: 'get'
  })
}

// 人员信息
export function personDetail (id) {
    return selt.request({
      url: `/api/system/sys_person_details/getByPersonId/${id}`,
      method: 'get'
    })
  }

  // 根据personId获取人员信息及从业资格证
export function getPerson (personId) {
  return selt.request({
    url: `/api/resp/firstResponsiblePerson/getPersonAndCertificateByPersonId/${personId}`,
    method: 'get'
  })
}

  //第一责任人认证审核
export function auth (data) {
  return selt.request({
    url: `/api/resp/firstResponsiblePerson/auth`,
    method: 'post',
    data
  })
}

// 获取安全第一责任人详情 
export function getPerson2 (id) {
  return selt.request({
    url: `/api/resp/firstResponsiblePerson/get/${id}`,
    method: 'get',
  })
}

// 获取认证记录 
export function authRecord (orgId) {
  return selt.request({
    url: `/api/resp/respAuthRecord/getApprovalList/${orgId}`,
    method: 'get',
  })
}

// 获取认证信息
export function authDetail (id) {
  return selt.request({
    url: `/api/resp/firstResponsiblePerson/get/${id}`,
    method: 'get',
  })
}


export const pageQueryListData = (data={}) => {
  return selt.request({
    url: "/api/resp/firstResponsiblePerson/pageByQueryExpr",
    method: "POST",
    data,
  });
};