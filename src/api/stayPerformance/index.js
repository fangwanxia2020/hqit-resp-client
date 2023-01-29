import Vue from 'vue'
const selt = Vue.prototype


// 提交待履职任务
export function addList (data) {
  return selt.request({
    url: `/api/resp/taskProcess/addList`,
    method: 'post',
    data
  })
}
// // 职责列表
// export function removeTaskProcess (id) {
//   return selt.request({
//     url: `/api/resp/taskProcess/remove/${id}`,
//     method: 'DELETE',
//   })
// }
export const getTaskListPage = (data={}) => {
  return selt.request({
    url: "/api/resp/task/listPage",
    method: "POST",
    data,
  });
};