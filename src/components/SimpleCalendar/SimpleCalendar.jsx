import React, { useState } from 'react'
import { Button, Calendar, Badge } from 'antd';
import styles from './SimpleCalendar.module.scss'
import classNames from 'classnames/bind'
import AddAppointment from '../AddAppointment/AddAppointment';
import { GoPlus } from 'react-icons/go';
import { UserAuth } from '../../context/AuthContext';

const cx = classNames.bind(styles);

const SimpleCalendar = () => {

    const today = new Date();
    const { user } = UserAuth();
    const [data, setData] = useState(localStorage.getItem('data') ? JSON.parse(localStorage.getItem('data')) : []);
    const [openModal, setOpenModal] = useState(false);
    const [currentDate, setCurrentDate] = useState(today.toISOString().split('T')[0].replace(/-/g, '-'));

    const showAddAppointment = () => {
        setOpenModal(true);
    };

    const getListData = (value) => {
        let listData = [];
        data.map((item) => {
            if (
                item.date === value.format('YYYY-MM-DD') && 
                item.username === user.displayName && 
                item.email === user.email
            ) {
                listData = [...listData, item];
            }
        })
        return listData || [];
    };
    
    const getMonthData = (value) => {
        if (value.month() === 8) {
            return 1394;
        }
    };
    
    const cellRender = (current, info) => {
        if (info.type === 'date') {
            const listData = getListData(current);
            return (
                <ul className={cx("events")}>
                    {listData.map((item, index) => (
                        <li key={index}>
                            <Badge status={'success'} text={item.title} />
                        </li>
                    ))}
                </ul>
            );
        } 
        if (info.type === 'month') {
            const num = getMonthData(current);
            return num ? (
                <div className="notes-month">
                    <section>{num}</section>
                    <span>Backlog number</span>
                </div>
            ) : null;
        }
        return info.originNode;
    };

    const onPanelChange = (value, mode) => {
        console.log(value.format('YYYY-MM-DD'), mode);
    };

    const handleChange = (value) => {
        console.log(currentDate);
        setCurrentDate(value.format('YYYY-MM-DD'))
    }

    return (
        <div className={cx("wrapper")}>
            <div className={cx("wrapper__content")}>
                <h1 style={{fontSize: 18}}>Appointment Calendar</h1>
                <Button
                    className={cx("button")}
                    onClick={showAddAppointment}
                >
                    <GoPlus style={{padding: '2px 4px 0 0'}} />
                    Add Appointment
                </Button>
                <AddAppointment 
                    date={currentDate} 
                    openModal={openModal} 
                    setOpenModal={setOpenModal} 
                />
            </div>
            <div className={cx("wrapper__calendar")}>
                <Calendar 
                    cellRender={cellRender} 
                    onChange={handleChange}
                    onPanelChange={onPanelChange} 
                />
            </div>
        </div>
    )
}

export default SimpleCalendar;