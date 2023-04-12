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

  console.log(listAppointments);

  return (
    <div className={cx('reminder')}>
      <h3 style={{textAlign: 'center', fontSize: 40}}>Reminder</h3>
      <div className={cx('reminder-list')}>
        {listAppointments.map((appointment, index) => {
          if (appointment.email === user.email) {
            return (
              <div 
                className={cx('reminder-item')} 
                key={index} 
                onClick={() => showReminder(appointment)}
              >
                <div className={cx('reminder-item__name')}>{appointment.title}</div>
                <div className={cx('reminder-item__date')}>{appointment.date}</div>
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