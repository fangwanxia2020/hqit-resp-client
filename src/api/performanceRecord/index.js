import Vue from 'vue'
const selt = Vue.prototype


// 获取履职任务详情
export function getInfo (id) {
  return selt.request({
    url: `/api/resp/task/getInfo/${id}`,
    method: 'post'
  })
}

// 撤回履职任务
export function revokeTask (id) {
  return selt.request({
    url: `/api/resp/task/revokeTask/${id}`,
    method: 'post'
  })
}


//下载
export function getDownload (data) {
  return selt.request({
    url: '/api/sysfile/file_info/download',
    method: 'get',
    responseType: 'blob', // 表明返回服务器返回的数据类型
    params: data
  })
}

export function addList (data) {
  return selt.request({
    url: `/api/resp/taskProcess/addList`,
    method: 'post',
    data
  })
}