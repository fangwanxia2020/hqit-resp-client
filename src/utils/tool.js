/** 通用js方法封装处理 */
import Vue from 'vue'

// 日期格式化
export function parseTime(time, pattern) {
  if (arguments.length === 0 || !time) {
    return null
  }
  const format = pattern || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if (typeof time === 'string' && /^[0-9]+$/.test(time)) {
      time = parseInt(time)
    } else if (typeof time === 'string') {
      time = time.replace(new RegExp(/-/gm), '/')
    }
    if (typeof time === 'number' && time.toString().length === 10) {
      time = time * 1000
    }
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay(),
  }
  const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    let value = formatObj[key]
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') {
      return ['日', '一', '二', '三', '四', '五', '六'][value]
    }
    if (result.length > 0 && value < 10) {
      value = '0' + value
    }
    return value || 0
  })
  return time_str
}

// 表单重置
export function resetForm(refName) {
  if (this.$refs[refName]) {
    this.$refs[refName].resetFields()
  }
}

// 添加日期范围
export function addDateRange(params, dateRange) {
  var search = params
  search.beginTime = ''
  search.endTime = ''
  if (null != dateRange && '' != dateRange) {
    search.beginTime = this.dateRange[0]
    search.endTime = this.dateRange[1]
  }
  return search
}

// 回显数据字典
export function selectDictLabel(datas, value) {
  var actions = []
  Object.keys(datas).map((key) => {
    if (datas[key].dictValue == '' + value) {
      actions.push(datas[key].dictLabel)
      return false
    }
  })
  return actions.join('')
}

// 通用下载方法
export function download(fileName) {
  window.location.href =
    process.env.VUE_APP_BASE_API +
    '/common/download?fileName=' +
    encodeURI(fileName) +
    '&delete=' +
    true
}

/**
 * 发送请求，使用流下载文件，防止打开窗口
 * @param {string} url 文件源地址
 * @param {string} fileName 文件名
 * @returns {Promise}
 */
export async function downloadFile(url, fileName) {
  const { request } = Vue.prototype
  const res = await request({
    url,
    methods: 'get',
    responseType: 'blob',
    needToken: false,
  })
  if (!res) return
  const a = document.createElement('a')
  const blob = new Blob([res.data])
  const downloadUrl = URL.createObjectURL(blob)
  a.href = downloadUrl
  a.download = fileName
  a.click()
}

// 字符串格式化(%s )
export function sprintf(str) {
  var args = arguments,
    flag = true,
    i = 1
  str = str.replace(/%s/g, function () {
    var arg = args[i++]
    if (typeof arg === 'undefined') {
      flag = false
      return ''
    }
    return arg
  })
  return flag ? str : ''
}

// 转换字符串，undefined,null等转化为""
export function praseStrEmpty(str) {
  if (!str || str == 'undefined' || str == 'null') {
    return ''
  }
  return str
}

/**
 * 构造树型结构数据
 * @param {*} data 数据源
 * @param {*} id id字段 默认 'id'
 * @param {*} parentId 父节点字段 默认 'parentId'
 * @param {*} children 孩子节点字段 默认 'children'
 * @param {*} rootId 根Id 默认 0
 */
export function handleTree(data, id, parentId, children, rootId) {
  id = id || 'id'
  parentId = parentId || 'parentId'
  children = children || 'children'
  rootId = rootId || 0
  //对源数据深度克隆
  const cloneData = JSON.parse(JSON.stringify(data))
  //循环所有项
  const treeData = cloneData.filter((father) => {
    let branchArr = cloneData.filter((child) => {
      //返回每一项的子级数组
      return father[id] === child[parentId]
    })
    branchArr.length > 0 ? (father.children = branchArr) : ''
    //返回第一层
    return father[parentId] === rootId
  })
  return treeData != '' ? treeData : data
}

//获取树形结构id

export function getTreeId(arr) {
  const ids = []
  const forFn = function (arr) {
    arr.map((item) => {
      ids.push(item.id)
      if (item.children && item.children.length) {
        forFn(item.children)
      }
    })
  }
  forFn(arr)
  return ids
}

export function deepClone(source) {
  if (!source && typeof source !== "object") {
    throw new Error("error arguments", "deepClone");
  }
  const targetObj = source.constructor === Array ? [] : {};
  Object.keys(source).forEach((keys) => {
    if (source[keys] && typeof source[keys] === "object") {
      targetObj[keys] = deepClone(source[keys]);
    } else {
      targetObj[keys] = source[keys];
    }
  });
  return targetObj;
}

// 错误边界
export const errorBoundary = async (cb, handleError) => {
  try {
    return await cb();
  } catch (error) {
    handleError && handleError(error);
    return false;
  }
};

// 删除提示
export const delPrompt = (instance, name,valAllText=false) => {
  const text=valAllText?name:   "<span>确定要删除</span> <span style='color:#4E9AF2'>“ " +
  name +
  " ”</span> <span>的相关信息么?</span>"
""
  return () =>
    instance.$confirm(
      text,
      {
        confirmButtonText: "删除",
        cancelButtonText: "取消",
        type: "warning",
        showClose: false,
        dangerouslyUseHTMLString: true,
        cancelButtonClass: "cancelButton",
        confirmButtonClass: "deleteButton-confirm",
      },
    );
};

/*
* 表格filters筛选数据
* list	数组
* text 显示的值
* value 选中后传递的值
* */
export function tableFilters(list,text,value){
	let tempArr=[]
	list.forEach(item=>{
		tempArr.push({
			"text":item[text],
			"value":item[value]
		})
	})
	return tempArr
}

/*
* 列表数据 -- 处理时间格式
* time 时间 格式为 2022-01-22 10:02:00 长度19位
* len 截取长度
* */
export function timeHandler(time,len){
	if (time && time.length === 19){
		return time.slice(0,len)
	}else {
		return ""
	}
}