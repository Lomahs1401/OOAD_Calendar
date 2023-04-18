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
import { FaUser } from 'react-icons/fa'
import { Header, Content } from 'antd/es/layout/layout'
import Sider from 'antd/es/layout/Sider';
import SimpleCalendar from '../../components/SimpleCalendar/SimpleCalendar';
import Reminder from '../../components/Reminder/Reminder';
import { useNavigate } from 'react-router-dom';
import { UserAuth } from '../../context/AuthContext';
import { auth, db } from '../../firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';

const cx = classNames.bind(styles);

const Home = () => {
  const CALENDAR = 'calendar';
  const MANAGE_REMINDER = 'manage_reminder';
  const LOGOUT = 'logout';

  const [collpased, setCollapsed] = useState(false);
  const [currentMenu, setCurrentMenu] = useState(CALENDAR);
  const [appointments, setAppointments] = useState([]);
  const [isAddNewAppointment, setIsAddNewAppointment] = useState(false);
  const appointmentsCollectionRef = collection(db, "appointments");

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

  useEffect(() => {
    const getAppointments = async () => {
      const q = query(appointmentsCollectionRef, where('username', '==', auth.currentUser?.displayName))

      const querySnapshot = await getDocs(q);

      let appointments = []  
      querySnapshot.forEach((doc) => {
        appointments.push({ ...doc.data(), id : doc.id });
      })
      setAppointments(appointments);
    };
    
    getAppointments();
    console.log(appointments);
    console.log("Chạy đi cu")

  }, [])

  const handleLogout = async () => {
    try {
      await logout()
      navigate('/')
    } catch (e) {
      message.error('Oops! Try again..')
    }
  }

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
        <div className={cx("welcome")}>
          <FaUser />
          <h1>{auth.currentUser?.displayName}</h1>
        </div>  
      </Header>
      <Layout>
        <Sider 
          theme='light' 
          collapsed={collpased}
          className={cx("sider")}
        >
          <Menu 
            mode='inline' 
            onClick={handleClickMenu} 
            selectedKeys={[currentMenu]} 
            items={items} 
          />
        </Sider>
        <Content className={cx("content")}>
          <Row>
            {(() => {
              if (currentMenu === CALENDAR) return <SimpleCalendar listAppointments={appointments} />
              else if (currentMenu === MANAGE_REMINDER) return <Reminder listAppointments={appointments} />
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