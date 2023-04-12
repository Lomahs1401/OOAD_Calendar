import {
  Layout,
  Menu,
  Row,
  message,
} from 'antd';
import React, { useEffect, useState } from 'react'
import styles from './Home.module.scss'
import classNames from 'classnames/bind'
import { RxHamburgerMenu } from 'react-icons/rx'
import { IoMdCalendar, IoIosNotifications } from 'react-icons/io'
import { FiLogOut } from 'react-icons/fi'
import { Header, Content } from 'antd/es/layout/layout'
import Sider from 'antd/es/layout/Sider';
import SimpleCalendar from '../../components/SimpleCalendar/SimpleCalendar';
import Reminder from '../../components/Reminder/Reminder';
import { useNavigate } from 'react-router-dom';
import { UserAuth } from '../../context/AuthContext';

const cx = classNames.bind(styles);

const Home = () => {
  const CALENDAR = 'calendar';
  const MANAGE_REMINDER = 'manage_reminder';
  const LOGOUT = 'logout';

  const [collpased, setCollapsed] = useState(false);
  const [currentMenu, setCurrentMenu] = useState(CALENDAR);

  const [data, setData] = useState(localStorage.getItem('data') ? JSON.parse(localStorage.getItem('data')) : [])

  const navigate = useNavigate();

  const { logout } = UserAuth();

  const handleClickMenu = (e) => {
    setCurrentMenu(e.key);
  };

  const items = [
    {
      title: "Schedule",
      label: "Schedule",
      key: CALENDAR,
      icon: <IoMdCalendar />,
    },
    {
      title: "Reminder",
      label: "Reminder",
      key: MANAGE_REMINDER,
      icon: <IoIosNotifications />
    },
    {
      title: "Logout",
      label: "Logout",
      key: LOGOUT,
      icon: <FiLogOut />
    },
  ]

  const handleLogout = async () => {
    try {
      await logout()
      navigate('/')
    } catch (e) {
      console.log(e);
      message.error('Oops! Try again..')
    }
  }

  // useEffect(() => {
  //   if (user !== null) {
  //     localStorage.setItem('username', user.displayName);
  //     localStorage.setItem('email', user.email);
  //   }

  //   // return (() => {
  //   //   localStorage.removeItem('username');
  //   //   localStorage.removeItem('email');
  //   // })
  // }, [])

  return (
    <Layout className={cx("container")}>
      <Header className={cx("header")}>
        <div className={cx("header__wrapper")}>
          <RxHamburgerMenu
            onClick={() => setCollapsed(!collpased)}
            className={cx("hamburger-icon")}
            size={30}
          />
          <div className={cx("brand")}>
            Appointment Calendar App
          </div>
        </div>
      </Header>
      <Layout>
        <Sider theme='light' collapsed={collpased}>
          <Menu mode='inline' onClick={handleClickMenu} selectedKeys={[currentMenu]} items={items} />
        </Sider>
        <Content className={cx("content")}>
          <Row>
            {(() => {
              if (currentMenu === CALENDAR) return <SimpleCalendar />
              else if (currentMenu === MANAGE_REMINDER) return <Reminder listAppointments={data} />
              else {
                handleLogout()
              }
            })()}
          </Row>
        </Content>
      </Layout>
    </Layout>
  )
}

export default Home