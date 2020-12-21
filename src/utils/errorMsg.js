/**
 * 自定义错误码
 */

const errorList = {
  '400': '错误的请求',
  '40000': '无效的参数',
  '40001': '参数为空',
  '40002': '参数格式错误',
  '40003': '参数超出值域范围',
  '40004': '验证码错误',
  '40005': '短信验证码错误',
  '40010': '无效的头信息',
  '40011': '头信息为空',
  '40012': '头信息太长',
  '401': '未经授权的请求',
  '40100': '未经授权的请求',
  '40101': 'accessToken错误或已过期',
  '40102': 'refreshToken错误或已过期',
  '402': '请先付款',
  '403': '请求被禁止',
  '40300': '用户被禁用',
  '40301': '用户未激活',
  '404': '资源不存在',
  '40400': '当前请求待开发',
  '405': '不允许调用指定的方法',
  '408': '请求超时',
  '409': '请求有冲突',
  '410': '当前资源请求已被删除',
  '411': 'Content-Length头信息不能为空',
  '412': '先决条件错误',
  '413': '请求实体过大，超出服务器的处理能力',
  '41300': '上传文件太大',
  '415': '不支持当前请求类型',
  '41502': '上传的文件类型不支持',
  '422': '不可加工的实体',
  '42200': '不可加工的文件',
  '42201': '不可加工的图片',
  '423': '当前资源被锁定',
  '42300': '当前文件被占用',
  '426': '客户端需要更新',
  '42600': '客户端应用需要更新',
  '42601': '客户端配置需要更新',
  '42602': '客户端资源需要更新',
  '429': '操作太频繁',
  '42900': '重复的请求',
  '42901': '被忽略的请求',
  '500': '内部服务器错误',
  '50000': '内部无效的参数',
  '50001': '内部参数为空',
  '50002': '内部参数格式错误',
  '50003': '内部参数超出值域范围',
  '50010': '代码存在问题',
  '50011': '注解设置有误',
  '50020': '业务错误',
  '50021': '业务逻辑错误',
  '50022': '业务处理错误',
  '50030': '数据库异常',
  '50031': '数据库链接失败',
  '50032': '数据库连接超时',
  '50033': '新增数据失败',
  '50034': '删除数据失败',
  '50035': '更新数据失败',
  '50036': '查询数据失败',
  '50040': '数据有误',
  '50041': '数据未找到',
  '50042': '数据字段无效',
  '50043': '数据字段为空',
  '50044': '数据状态异常',
  '50045': '数据无效或已过期',
  '50046': '数据转换失败',
  '50047': '数据版本有误',
  '50050': '远端服务错误',
  '50051': '服务内部创建远端服务连接出错',
  '50052': '服务内部创建远端服务连接超时',
  '50053': '服务内部调用远端服务出错',
  '50054': '服务内部调用远端服务返回结果错误',
  '50060': '消息错误',
  '50061': '消息发送失败',
  '50062': '消息队列错误',
  '50063': '消息队列发送失败',
  '50071': 'IO错误',
  '50072': '流错误',
  '50073': '文件流错误',
  '50074': '网络传输流错误',
  '503': '服务暂时不可用或维护中',
  '506': '服务器内部配置错误',
  '50600': '配置错误',
  '50601': '数据库中的配置错误',
  '50602': '配置文件中的配置错误',
  '507': '存储空间不足，无法完成请求',
  '50700': '磁盘空间不足，无法完成请求',
  '50701': '内存空间不足，无法完成请求',
  '508': '当前请求出现了无限循环'
}

export function getMsgByErrorCode(errorCode) {
  return errorList[errorCode]
}

export function checkCodeWhitelist(errorCode) {
  const whitelist = [40100, 40101, 40102]
  return whitelist.includes(errorCode)
}
