import React, { memo, useEffect, useCallback, useState, useRef, useImperativeHandle } from 'react'

import { Button, Table, Space, Switch, message, Modal } from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons'

import _ from 'lodash'

import { getQuery, remove, post } from '@/request/http'

import { btnAuthorityFun } from 'page/utils'

import { PageModal } from 'page/children'

import pageTableCss from './pageTable.module.css'
import './pageTableResetAntd.css'

const { confirm } = Modal

const PageTable = memo((props) => {
  const { pageRequestUrl, pageTableConfig, pageModalConfig, searchData } = props
  const { curdUrl, getMoreParams, postMoreParams, putMoreParams, enableUrl, disabledUrl } =
    pageRequestUrl
  const {
    columns,
    pageAuthorityArr,
    actionColumnsWidth = 500,
    isShowAddBtn = true,
    isShowCheckDetailsBtn = true,
    isShowUpdateBtn = true,
    isShowRemoveBtn = true,
    isShowEnableDisableBtn = true,
    isShowActionColumns = true,
    tableMoreButtonArr = [],
    pageMoreButtonArr = [],
    scroll = { x: 1500, y: 490 },
    accordingRowIsRenderCheckBtnFun = () => true,
    accordingRowIsRenderUpdateBtnFun = () => true,
    accordingRowIsRenderRemoveBtnFun = () => true,
    accordingRowIsRenderEDBtnFun = () => true
  } = pageTableConfig

  const cloneDeepPageModalConfig = useRef(null)

  if (cloneDeepPageModalConfig.current) {
    cloneDeepPageModalConfig.current = Object.assign(
      cloneDeepPageModalConfig.current,
      _.cloneDeep(pageModalConfig)
    )
    cloneDeepPageModalConfig.current.saveUrl = curdUrl
    cloneDeepPageModalConfig.current.postMoreParams = postMoreParams
    cloneDeepPageModalConfig.current.putMoreParams = putMoreParams
  }

  useImperativeHandle(props.onRef, () => {
    return {
      getTableDataFun
    }
  })

  const pageNum = useRef(1)
  const pageSize = useRef(10)

  const [tableData, setTableData] = useState({})

  const [selectedRowKeys, setSelectedRowKeys] = useState([])

  const [isModalVisible, setIsModalVisible] = useState(false)

  const tableBtnArr = [
    renderCheckRowDetailsBtnFun(),

    renderUpdateRowDataBtnFun(),

    renderRemoveRowDataBtnFun(),

    ...tableMoreButtonArr,

    renderEnableDisableBtnFun()
  ]

  const newColumns = [
    ...columns,
    {
      title: '??????',
      key: 'action',
      align: 'center',
      fixed: 'right',
      width: actionColumnsWidth,
      render: (_, record) => (
        <Space size="middle">
          {tableBtnArr.map((itemFun) => {
            if (itemFun instanceof Function && itemFun(record)) {
              return itemFun(record)
            }
            return ''
          })}
        </Space>
      )
    }
  ]

  // ??????isShowActionColumns???false ???????????????newColumns????????????????????????????????????
  if (!isShowActionColumns) {
    newColumns.splice(newColumns.length - 1, 1)
  }

  const paginationConfig = {
    pageSizeOptions: [5, 10, 15, 20],
    responsive: true,
    showSizeChanger: true,
    showQuickJumper: true,
    showTotal: () => `???` + tableData.total + `???`,
    pageSize: pageSize.current,
    current: pageNum.current,
    total: tableData.total,
    onChange: (current, pagesize) => {
      pageNum.current = current
      pageSize.current = pagesize
      getTableDataFun()
    }
  }

  const rowSelection = {
    selectedRowKeys: selectedRowKeys,
    onChange: (selectedRowKeys) => {
      setSelectedRowKeys(selectedRowKeys)
    }
  }

  const getTableDataFun = useCallback(() => {
    let cloneDeepSearchData = _.cloneDeep(searchData)

    if (cloneDeepSearchData.isSearch) {
      cloneDeepSearchData.pageNum = 1
    } else {
      cloneDeepSearchData.pageNum = pageNum.current
    }

    cloneDeepSearchData.pageSize = pageSize.current
    cloneDeepSearchData = Object.assign(cloneDeepSearchData, getMoreParams)

    getQuery(curdUrl, cloneDeepSearchData).then((res) => {
      setTableData(res.data)
    })
  }, [curdUrl, searchData, getMoreParams])

  const commonConfirmFun = (title, callBackFun) => {
    confirm({
      title: title,
      icon: <ExclamationCircleOutlined />,
      onOk() {
        callBackFun && callBackFun()
      },
      onCancel() {
        console.log('Cancel')
      }
    })
  }

  function renderCheckRowDetailsBtnFun() {
    if (isShowCheckDetailsBtn && btnAuthorityFun(pageAuthorityArr, '??????')) {
      return function (record) {
        if (accordingRowIsRenderCheckBtnFun(record)) {
          return (
            <Button
              key={1}
              type="text"
              style={{ color: '#1890FF' }}
              onClick={() => {
                showModalFun('??????', record.id)
              }}
            >
              ??????
            </Button>
          )
        }
      }
    }
  }

  function renderUpdateRowDataBtnFun() {
    if (isShowUpdateBtn && btnAuthorityFun(pageAuthorityArr, '??????')) {
      return function (record) {
        if (accordingRowIsRenderUpdateBtnFun(record)) {
          return (
            <Button
              key={2}
              type="text"
              style={{ color: '#48ED4B' }}
              onClick={() => {
                showModalFun('??????', record.id)
              }}
            >
              ??????
            </Button>
          )
        }
      }
    }
  }

  function renderRemoveRowDataBtnFun() {
    if (isShowRemoveBtn && btnAuthorityFun(pageAuthorityArr, '??????')) {
      return function (record) {
        if (accordingRowIsRenderRemoveBtnFun(record)) {
          return (
            <Button
              key={3}
              type="text"
              style={{ color: '#EB3030' }}
              onClick={() => {
                removeTableItemDataFun(record.id)
              }}
            >
              ??????
            </Button>
          )
        }
      }
    }
  }

  function renderEnableDisableBtnFun() {
    if (isShowEnableDisableBtn && btnAuthorityFun(pageAuthorityArr, '????????????')) {
      return function (record) {
        if (accordingRowIsRenderEDBtnFun(record)) {
          return (
            <Switch
              key={4}
              checkedChildren="??????"
              unCheckedChildren="??????"
              checked={record.status === 1}
              onClick={(checked) => {
                enableOrDisableFun(checked, [record.id])
              }}
            />
          )
        }
      }
    }
  }

  const showModalFun = (title, rowId) => {
    if (!pageModalConfig) {
      console.warn('???????????????????????????????????????pageModalConfig????????????')
      return
    }
    cloneDeepPageModalConfig.current = {}
    cloneDeepPageModalConfig.current.modalTitle = title
    rowId
      ? (cloneDeepPageModalConfig.current.itemId = rowId)
      : (cloneDeepPageModalConfig.current.itemId = '')
    setIsModalVisible(true)
  }

  const closeModalFun = (_, isRequestTableData) => {
    if (isRequestTableData) {
      getTableDataFun()
    }
    setIsModalVisible(false)
  }

  const removeTableItemDataFun = (id) => {
    function callBackFun() {
      remove(curdUrl, { id }).then(() => {
        message.success('????????????')
        getTableDataFun()
      })
    }

    commonConfirmFun('????????????????????????', callBackFun)
  }

  const enableRowsFun = () => {
    if (selectedRowKeys.length === 0) {
      message.warning('???????????????????????????')
      return
    }
    enableOrDisableFun(true, selectedRowKeys)
  }

  const disableRowsFun = () => {
    if (selectedRowKeys.length === 0) {
      message.warning('???????????????????????????')
      return
    }

    enableOrDisableFun(false, selectedRowKeys)
  }

  // ???????????????
  const enableOrDisableFun = (isEnable, rowIdArr) => {
    let callBackFun = null
    if (isEnable) {
      // ??????
      callBackFun = () => {
        post(enableUrl || `${curdUrl}start/`, { ids: rowIdArr }).then((res) => {
          message.success('?????????')
          getTableDataFun()
        })
      }

      commonConfirmFun('?????????????????????', callBackFun)
    } else {
      // ??????
      callBackFun = () => {
        post(disabledUrl || `${curdUrl}stop/`, { ids: rowIdArr }).then((res) => {
          message.warning('?????????')
          getTableDataFun()
        })
      }

      commonConfirmFun('?????????????????????', callBackFun)
    }
  }

  useEffect(() => {
    getTableDataFun()
  }, [getTableDataFun])

  return (
    <div className={`${pageTableCss.page_table} page_table`}>
      <div className={pageTableCss.page_table_top}>
        <div className={pageTableCss.page_table_title}>????????????</div>
        <div className="page_table_btns">
          {isShowAddBtn && btnAuthorityFun(pageAuthorityArr, '??????') && (
            <Button
              type="primary"
              onClick={() => {
                showModalFun('??????')
              }}
            >
              ??????
            </Button>
          )}
          {isShowEnableDisableBtn && btnAuthorityFun(pageAuthorityArr, '????????????') && (
            <Button
              className={pageTableCss.start_btn}
              onClick={() => {
                enableRowsFun()
              }}
            >
              ??????
            </Button>
          )}
          {isShowEnableDisableBtn && btnAuthorityFun(pageAuthorityArr, '????????????') && (
            <Button
              className={pageTableCss.stop_btn}
              onClick={() => {
                disableRowsFun()
              }}
            >
              ??????
            </Button>
          )}
          {pageMoreButtonArr.map((itemFun) => {
            if (itemFun instanceof Function) {
              return itemFun(selectedRowKeys)
            }
            return ''
          })}
        </div>
      </div>

      <Table
        size="small"
        style={{ padding: '0 36px' }}
        scroll={scroll}
        columns={newColumns}
        dataSource={tableData.list}
        pagination={paginationConfig}
        rowSelection={rowSelection}
        rowKey={(record) => record.id}
      />

      {cloneDeepPageModalConfig.current && (
        <PageModal
          isModalVisible={isModalVisible}
          pageModalConfig={cloneDeepPageModalConfig.current}
          onCloseModal={closeModalFun}
        ></PageModal>
      )}
    </div>
  )
})

export default PageTable
