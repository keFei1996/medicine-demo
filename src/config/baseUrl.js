window.prefix = 'https://www.jyhk.com'
console.log('7895446', process.env.VUE_APP_TITLE)
if (process.env.VUE_APP_TITLE === 'xj') {
  // window.prefix = 'http://49.119.98.48:80' // 正式
  window.prefix = 'https://www.jyhk.com/xj' // 新疆测试
}

window.baseUrl = {
  //测试-本地服务器
  "home_url": "http://localhost:8025", // 测试环境前端地址
  // "home_url":"http://139.9.170.28:28091/internet-treatment-manage", // 正式环境前端地址
  "manageSys_url": window.prefix + "/otsp-manage-sys",
  "file_url": window.prefix + "/otsp-file",
  "system_url": window.prefix + "/otsp-system",
  "service_url": window.prefix + "/otsp-service",
  "info_url": window.prefix + "/otsp-info", //内容管理
  "schedule_url":  window.prefix + "/otsp-schedule",
  "interview_url":  window.prefix + "/otsp-interview",
  "message_url": window.prefix + '/otsp-message'
}
