import React, { memo, useState, useCallback, useContext, Suspense } from 'react'

import { useSelector, shallowEqual, useDispatch } from 'react-redux'

import { useHistory } from 'react-router-dom'
import { renderRoutes } from 'react-router-config'

import { ThemeContext } from '@/App'

import {
  setCurrentOneMenuPathA,
  setCurrentTwoMenuPathA,
  setMenuDataA
} from '@/store/createAction/frameWork.js'

// 样式
import frameWorkCss from './frameWork.module.css'
import './frameWorkResetAntd.css'

import { Layout, Menu, Button } from 'antd'
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  HomeOutlined,
  SmileOutlined,
  TeamOutlined
} from '@ant-design/icons'

const { Header, Sider, Content } = Layout

const { SubMenu } = Menu

const FrameWork = memo((props) => {
  const { route } = props

  const theme = useContext(ThemeContext)

  const { currentOneMenuPath, currentTwoMenuPath, menuData } = useSelector((state) => {
    return {
      currentOneMenuPath: state.get('frameWork').get('currentOneMenuPathR'),
      currentTwoMenuPath: state.get('frameWork').get('currentTwoMenuPathR'),
      menuData: state.get('frameWork').get('menuDataR')
    }
  }, shallowEqual)

  const history = useHistory()

  const dispatch = useDispatch()

  const [collapsed, setCollapsed] = useState(false)

  const [openKeys, setOpenKeys] = useState([])

  const toggle = useCallback(() => {
    setCollapsed(!collapsed)
  }, [collapsed])

  const getSelectedPath = useCallback(
    (twoMenu, oneMenuPath) => {
      history.push({
        pathname: twoMenu.path,
        state: {
          pageAuthorityArr: twoMenu.children || []
        }
      })

      // 派发(把选中的一级菜单 二级菜单path保存到redux中)
      dispatch(setCurrentTwoMenuPathA(twoMenu.path))
      dispatch(setCurrentOneMenuPathA(oneMenuPath))
    },
    [history, dispatch]
  )

  const onOpenChange = (keys) => {
    setOpenKeys([keys[keys.length - 1]])
  }

  const exit = useCallback(() => {
    // 需要清空缓存数据以及重置redux frameWork state数据
    localStorage.clear()
    dispatch(setCurrentTwoMenuPathA(''))
    dispatch(setCurrentOneMenuPathA(''))
    dispatch(setMenuDataA([]))

    history.replace('/login')
  }, [dispatch, history])

  return (
    <div className="frame_work">
      <Layout style={{ height: '100vh' }}>
        <Sider
          collapsible
          trigger={null}
          style={{ background: theme.siderBgColor }}
          collapsed={collapsed}
        >
          <div className={frameWorkCss.cms_name}>{collapsed ? '' : 'Betteryourself'}</div>
          <Menu
            mode="inline"
            theme={theme.menuTheme || 'light'}
            style={{ background: theme.menuBgColor }}
            openKeys={openKeys.length === 0 ? [currentOneMenuPath] : openKeys}
            selectedKeys={[currentTwoMenuPath]}
            onOpenChange={onOpenChange}
          >
            {menuData.map((oneMenu) => {
              if (!oneMenu.children || oneMenu.children.length === 0) {
                return (
                  <Menu.Item
                    key={oneMenu.path}
                    icon={<HomeOutlined />}
                    onClick={() => {
                      getSelectedPath(oneMenu)
                    }}
                  >
                    {oneMenu.name}
                  </Menu.Item>
                )
              } else {
                return (
                  <SubMenu key={oneMenu.path} title={oneMenu.name} icon={<SmileOutlined />}>
                    {oneMenu.children.map((twoMenu) => {
                      return (
                        <Menu.Item
                          key={twoMenu.path}
                          icon={<TeamOutlined />}
                          onClick={() => {
                            getSelectedPath(twoMenu, oneMenu.path)
                          }}
                        >
                          {twoMenu.name}
                        </Menu.Item>
                      )
                    })}
                  </SubMenu>
                )
              }
            })}
          </Menu>
        </Sider>

        <Layout>
          <Header style={{ background: theme.headBgColor }} className={frameWorkCss.header}>
            {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
              className: 'trigger',
              style: { color: '#000000', fontSize: '20px' },
              onClick: toggle
            })}

            <div className={frameWorkCss.header_right}>
              <Button
                onClick={() => {
                  exit()
                }}
                size="small"
                type="primary"
              >
                退出程序
              </Button>
            </div>
          </Header>
          <Content
            className={frameWorkCss.content}
            style={{
              background: theme.mainBgColor
            }}
          >
            <Suspense fallback={<div>Loading...</div>}>{renderRoutes(route.routes)}</Suspense>
          </Content>
        </Layout>
      </Layout>
    </div>
  )
})

export default FrameWork
