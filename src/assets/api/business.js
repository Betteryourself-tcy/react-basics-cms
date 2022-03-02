import Mock from 'mockjs'

// 模拟延迟
Mock.setup({
  timeout: 200
})

// 公共数据
Mock.mock('http://localhost:3001/commonData', 'get', function () {
  return Mock.mock({
    code: 0,
    msg: '',
    result: '我是公共的数据 哈哈哈，配置生成页面 请去OneOne目录'
  })
})

// 查看表格数据及详情
Mock.mock(RegExp(`http://localhost:3001/oneOne?.*`), 'get', function (options) {
  console.log(options)
  if (options.url.indexOf('?') !== -1) {
    return Mock.mock({
      code: 0,
      msg: '',
      data: {
        total: 2,
        list: [
          {
            id: 1,
            name: 'tom',
            iphone: '1323097666',
            jobTitle: 1,
            status: 1
          },
          {
            id: 2,
            name: 'lili',
            iphone: '1323097888',
            jobTitle: 2,
            status: 0
          }
        ]
      }
    })
  } else {
    return Mock.mock({
      code: 0,
      msg: '',
      data: {
        name: '哈哈哈',
        password: '123456',
        fruit: 1,
        radioVal: 1,
        checkboxVal: [1],
        treeVal: [2],
        startDate: 1645514128000,
        endDate: 1645514129000,
        datePickerVal: 1645514128000
      }
    })
  }
})

// 删除某条数据
Mock.mock(
  RegExp(`http://localhost:3001/oneOne.*`),
  'delete',
  function (options) {
    console.log(options)
    return Mock.mock({
      code: 0,
      msg: '',
      data: '删除成功'
    })
  }
)

// 启用数据
Mock.mock(
  RegExp(`http://localhost:3001/oneOne/start.*`),
  'post',
  function (options) {
    console.log(options)
    return Mock.mock({
      code: 0,
      msg: '',
      data: '已启用'
    })
  }
)

// 禁用数据
Mock.mock(
  RegExp(`http://localhost:3001/oneOne/stop.*`),
  'post',
  function (options) {
    console.log(options)
    return Mock.mock({
      code: 0,
      msg: '',
      data: '已禁用'
    })
  }
)

// 新增数据
Mock.mock(RegExp(`http://localhost:3001/oneOne.*`), 'post', function (options) {
  console.log(options)
  return Mock.mock({
    code: 0,
    msg: '',
    data: '添加成功'
  })
})

// 修改数据
Mock.mock(RegExp(`http://localhost:3001/oneOne.*`), 'put', function (options) {
  console.log(options)
  return Mock.mock({
    code: 0,
    msg: '',
    data: '修改成功'
  })
})
