import React, { useState } from 'react'
import { UserAuth } from '../../context/AuthContext'
import ReminderDetail from '../ReminderDetail/ReminderDetail'
import styles from './Reminder.module.scss'
import classNames from 'classnames/bind'

const cx = classNames.bind(styles);

const Reminder = ({ listAppointments }) => {
  const {user} = UserAuth();
  const [reminderIsOpen, setReminderIsOpen] = useState(false);
  const [reminderData, setReminderData] = useState({});

  const showReminder = (appointment) => {
    setReminderIsOpen(true);
    setReminderData(appointment)
  }

  return (
    <div className={cx('reminder')}>
      <h3 style={{textAlign: 'center', fontSize: 40}}>Reminder</h3>
      <div className={cx('reminder-list')}>
        {listAppointments.map((appointment, index) => {
          if (appointment.email === user.email) {
            const startTime = appointment.startTime.toDate().toDateString();
            console.log(startTime);
            return (
              <div 
                className={cx('reminder-item')} 
                key={index} 
                onClick={() => showReminder(appointment)}
              >
                <div className={cx('reminder-item__name')}>{appointment.title}</div>
                <div className={cx('reminder-item__date')}>{startTime}</div>
              </div>
            )
          };
        })}
      </div>
      <ReminderDetail
        data={reminderData}
        openModal={reminderIsOpen}
        setOpenModal={setReminderIsOpen}
      />
    </div>
  )
}

export default Reminder