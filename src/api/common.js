import Vue from 'vue'
const selt = Vue.prototype

// 获取文件详情
export function fileInfo (data) {
  return selt.request({
    url: `/api/sysfile/file_info/listByIds`,
    method: 'post',
    data
  })
}