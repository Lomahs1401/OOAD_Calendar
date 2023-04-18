import React, { useState, useEffect } from 'react'
import { Button, Calendar, Badge } from 'antd';
import styles from './SimpleCalendar.module.scss'
import classNames from 'classnames/bind'
import AddAppointment from '../AddAppointment/AddAppointment';
import { GoPlus } from 'react-icons/go';
import { auth, db } from '../../firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import dayjs from 'dayjs';

const cx = classNames.bind(styles);

const SimpleCalendar = ({ listAppointments }) => {
  const [openModal, setOpenModal] = useState(false);
  const [currentDate, setCurrentDate] = useState(dayjs());

  // Handle click "Add Appointment" button
  const showAddAppointment = () => {
    setOpenModal(true);
  };

  // Handle click cell of calendar
  const handleClickCell = (item) => {
    // showReminder(item);
  }

  const getListData = (value) => {
    let listData = [];

    if (listAppointments) {
      listAppointments.map((appointment) => {
        const startTime = appointment.startTime.toDate() ;
        const cellTime = new Date(value);
        if (startTime.toDateString() === cellTime.toDateString()) {
          listData = [...listData, appointment];
        }
      })
    }

    return listData || [];
  };

  const cellRender = (current) => {
    const listData = getListData(current);
    return (
      <ul className={cx("events")}>
        {listData.map((item, index) => (
          <li key={index} onClick={() => handleClickCell(item)}>
            <Badge 
              color='#F5F3C1'
              status={'success'} 
              text={item.title} 
              className={cx("badge")}
            />
          </li>
        ))}
      </ul>
    );
  };

  const handleChange = (value) => {
    const date = dayjs(value);
    setCurrentDate(date)
  }

  return (
    <div className={cx("wrapper")}>
      <div className={cx("wrapper__content")}>
        <h1 style={{ fontSize: 18 }}>Appointment Calendar</h1>
        <Button
          className={cx("button")}
          onClick={showAddAppointment}
        >
          <GoPlus style={{ padding: '2px 4px 0 0' }} />
          Add Appointment
        </Button>
        <AddAppointment
          currentDate={currentDate}
          openModal={openModal}
          setOpenModal={setOpenModal}
        />
      </div>
      <div className={cx("wrapper__calendar")}>
        <Calendar
          cellRender={cellRender}
          onChange={handleChange}
          value={currentDate}
        />
      </div>
    </div>
  )
}

export default SimpleCalendar;