import React, { useState, useEffect, useRef } from 'react'
import { Modal, Button, Form, Input, message, DatePicker, Checkbox } from 'antd'
import Draggable from 'react-draggable';
import styles from './AddAppointment.module.scss'
import classNames from 'classnames/bind'
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2'
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { UserAuth } from '../../context/AuthContext';
import { db } from '../../firebase'
import dayjs from 'dayjs';
import { addDoc, collection } from 'firebase/firestore'


const cx = classNames.bind(styles);

const AddAppointment = ({ currentDate, openModal, setOpenModal }) => {
  dayjs.extend(customParseFormat);
  const addAppointmentFormLayout = {
    labelCol: {
      span: 8
    },
    wrapperCol: {
      span: 24
    },
  };

  const [startTime, setStartTime] = useState(currentDate.hour(dayjs().hour()).minute(dayjs().minute()).second(0))
  const [endTime, setEndTime] = useState(currentDate.hour(dayjs().hour()).minute(dayjs().minute()).add(30, 'minute'))
  const [remind, setRemind] = useState(false);
  const data = localStorage.getItem('data') ? JSON.parse(localStorage.getItem('data')) : []
  const { user } = UserAuth();
  const appointmentsCollectionRef = collection(db, "appointments");


  const navigate = useNavigate();

  // Handle click out boundary of modal 
  const handleOk = () => {
    setOpenModal(false);
  }

  // Handle click button "X" of modal
  const handleCancel = () => {
    setOpenModal(false);
  }

  // Handle check click "Remind me"
  const handleRemind = () => {
    setRemind(!remind);
  }

  // ---------------------------  Set field for date input  ---------------------------
  const [form] = Form.useForm();
  form.setFieldValue('username', user.displayName)
  form.setFieldValue('email', user.email)
  form.setFieldValue('startTime', startTime);
  form.setFieldValue('endTime', endTime);

  useEffect(() => {
    setStartTime(currentDate.hour(dayjs().hour()).minute(dayjs().minute()))
    setEndTime(currentDate.hour(dayjs().hour()).minute(dayjs().minute()).add(30, 'minute'))
  }, [currentDate])

  // ---------------------------      Modal Draggable      ---------------------------
  const draggleRef = useRef(null);
  const [disabled, setDisabled] = useState(false);
  const [bounds, setBounds] = useState({
    left: 0,
    top: 0,
    bottom: 0,
    right: 0,
  });

  const onStart = (_event, uiData) => {
    const { clientWidth, clientHeight } = window.document.documentElement;
    const targetRect = draggleRef.current?.getBoundingClientRect();
    if (!targetRect) {
      return;
    }
    setBounds({
      left: -targetRect.left + uiData.x,
      right: clientWidth - (targetRect.right - uiData.x),
      top: -targetRect.top + uiData.y,
      bottom: clientHeight - (targetRect.bottom - uiData.y),
    });
  };
  
  // const times = data.map((item) => {
  //   const date = item.date
  //   const startTime = new Date(item.startTime)
  //   const endTime = new Date(item.endTime)
  //   return {
  //     date: date,
  //     startTime: startTime,
  //     endTime: endTime
  //   }
  // })

  // const [overlapIndex, setOverlapIndex] = useState(-1)

  // ---------------------------      Validate wheather appointment of time is overlaped      ---------------------------
  // const checkTimeOverlap = (startTime, endTime) => {
  //   const startTmp = new Date(startTime)
  //   const endTmp = new Date(endTime)
  //   for (let i = 0; i < times.length; i++) {
  //     const element = times[i];
  //     if (startTmp < element.endTime && endTmp > element.startTime && currentDate === element.date) {
  //       setOverlapIndex(i)
  //       return true;
  //     }
  //   }
  //   return false
  // }

  // ---------------------------      Validate wheather appointment of time is overlaped      ---------------------------
  // const checkTimeOverlap = (startTime, endTime) => {
  //   const startTmp = new Date(startTime)
  //   const endTmp = new Date(endTime)
  //   for (let i = 0; i < times.length; i++) {
  //     const element = times[i];
  //     if (startTmp < element.endTime && endTmp > element.startTime && currentDate === element.date) {
  //       setOverlapIndex(i)
  //       return true;
  //     }
  //   }
  //   return false
  // }

  // ---------------------------      Validate wheather appointment duration is invalid    ---------------------------
  const validateTimeDifference = (rule, value, callback) => {
    const { getFieldValue } = form;
    const startTime = getFieldValue('startTime');
    const endTime = getFieldValue('endTime');
    // console.log('Start time', startTime);
    // console.log('End time', endTime);

    const startDate = new Date(startTime);
    const endDate = new Date(endTime);
    // console.log('Start date', startDate);
    // console.log('End date', endDate);

    const diffInMs = endDate - startDate;
    // console.log('Diff In Ms', diffInMs)

    const diffInMinutes = Math.floor((diffInMs / 1000) / 60);
    // console.log('Diff In Minutes', diffInMinutes)

    if (diffInMinutes < 1) {
      // console.log('Error')
      callback('Invalid duration');
    } else {
      // console.log('OK');
      callback();
    }
  };
  
  // ---------------------------      Validate wheather appointment is duplicated      ---------------------------
  // const validateDuplicateAppointment = () => {
  //   const appointmentName = form.getFieldValue('title')
  //   const date = form.getFieldValue('date')
  //   const startTime = new Date(form.getFieldValue('startTime'))
  //   const endTime = new Date(form.getFieldValue('endTime'))

  //   const data = localStorage.getItem('data') ? JSON.parse(localStorage.getItem('data')) : []

  //   startTime.setMilliseconds(0)
  //   endTime.setMilliseconds(0)
    
  //   for (let i = 0; i < data.length; i++) {
  //     const element = data[i];
  //     const elementStartTime = new Date(element.startTime)
  //     elementStartTime.setMilliseconds(0)
  //     const elementEndTime = new Date(element.endTime)
  //     elementEndTime.setMilliseconds(0)
  //     if (
  //       element.appointmentName === appointmentName && 
  //       element.date === date && 
  //       elementStartTime.getTime() === startTime.getTime() && 
  //       elementEndTime.getTime() === endTime.getTime()
  //     ) {
  //       return i
  //     }
  //   }
  //   return -1
  // }

  const disabledDate = (current) => {
    // Can not select days before today and today
    return current && current < dayjs().startOf('day');
  };

  // ---------------------------      Handle submit Form      ---------------------------
  // Failed case
  const onFinishFailed = (values) => {
    console.log('Error', values)
    message.error('Add appointment failed! Try again');
  }

  // Successful case
  const onFinish = async (values) => {
    console.log(values);
    currentDate.hour(dayjs().hour()).minute(dayjs().minute()).second(0)
    const startTime = dayjs(values.startTime).toDate();
    const endTime = dayjs(values.endTime).toDate();
    console.log(startTime);
    console.log(endTime);
    
    const { username, email, title, location, remind } = values;
    try {
      await addDoc(appointmentsCollectionRef, {username, email, title, location, startTime, endTime, remind});
      Swal.fire(
        'Created!',
        'Your appointment has been created.',
        'success'
      ).then(() => {
        navigate(0)
      })
    } catch(e) {
      console.log(e);
      message.error('Oops. Try again..');
    }
    // const dupplicateIndex = validateDuplicateAppointment()
    // if (dupplicateIndex !== -1) {
    //   Swal.fire({
    //     title: 'Appointment exist!',
    //     text: "The appointment you entered has been alrealdy exist! Do you want to join the group meeting instead?",
    //     icon: 'warning',
    //     showCancelButton: true,
    //     confirmButtonText: 'Join'
    //   }).then((result) => {
    //     if (result.isConfirmed) {
    //       let newData = [...data]
    //       if (!newData[dupplicateIndex].usernames.includes(localStorage.getItem('username'))) {
    //         newData[dupplicateIndex].usernames = [...newData[dupplicateIndex].usernames, localStorage.getItem('username')]
    //         localStorage.setItem('data', JSON.stringify(newData))
    //       }
    //       Swal.fire(
    //         'Hurray!',
    //         'You has been added to the group meeting!',
    //         'success'
    //       ).then(() => {
    //         navigate(0)
    //       })
    //     }
    //   })
    // }
    // else if (checkTimeOverlap(values.startTime, values.endTime)) {
    //   Swal.fire({
    //     title: 'Time overlapping?',
    //     text: "Your already has an appointment at that time! Do you want to replace it?",
    //     icon: 'warning',
    //     showCancelButton: true,
    //     cancelButtonText: 'Choose another time',
    //     confirmButtonText: 'Replace'
    //   }).then((result) => {
    //     if (result.isConfirmed) {
    //       let newData = [...data]
    //       newData.splice(overlapIndex, 1, values)
    //       localStorage.setItem('data', JSON.stringify(newData))
    //       Swal.fire(
    //         'Replaced!',
    //         'Your appointment has been replaced.',
    //         'success'
    //       ).then(() => {
    //         navigate(0)
    //       })
    //     }
    //   })
    // }
    // else {
    //   let data = localStorage.getItem('data') ? JSON.parse(localStorage.getItem('data')) : []
    //   const newData = [...data, values];
    //   localStorage.setItem('data', JSON.stringify(newData))
    //   setOpenModal(false);
    //   Swal.fire(
    //     'Created!',
    //     'Your appointment has been created.',
    //     'success'
    //   ).then(() => {
    //     navigate(0)
    //   })
    // }
  };

  return (
    <Modal
      title={
        <div
          style={{
            width: '100%',
            cursor: 'move',
            textAlign: 'center',
            marginBottom: 24
          }}
          onMouseOver={() => {
            setDisabled(false);
          }}
          onMouseOut={() => {
            setDisabled(true);
          }}
        >
          Add Appointment
        </div>
      }
      open={openModal}
      onOk={handleOk}
      onCancel={handleCancel}
      footer={null}
      modalRender={(modal) => (
        <Draggable
          disabled={disabled}
          bounds={bounds}
          onStart={(event, uiData) => onStart(event, uiData)}
        >
          <div ref={draggleRef}>{modal}</div>
        </Draggable>
      )}
    >
      <Form
        {...addAppointmentFormLayout}
        form={form}
        layout='vertical'
        name='appointment_form'
        labelAlign='left'
        labelWrap='true'
        size='large'
        autoComplete="off"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        className={cx("modal-form")}
        initialValues={{
          remind: true,
          username: user.displayName,
          email: user.email,
        }}
      >
        <Form.Item
          name='title'
          label="Title"
          rules={[
            {
              required: true,
              message: 'Title is required!'
            },
          ]}
          hasFeedback
        >
          <Input
            placeholder='Sinh nhật'
          />
        </Form.Item>
        <Form.Item
          name='username'
          label="User Name"
          rules={[
            {
              required: true,
            },
          ]}
          hasFeedback
          style={{ display: 'none' }}
        />
        <Form.Item
          name='email'
          label="Email"
          rules={[
            {
              required: true,
            },
          ]}
          hasFeedback
          style={{ display: 'none' }}
        />
        <Form.Item
          name='location'
          label="Location"
          rules={[
            {
              required: true,
              message: 'Location is required!'
            },
          ]}
          hasFeedback
        >
          <Input
            placeholder='Nhà hàng Sơn La'
          />
        </Form.Item>
        <Form.Item
          label="Start Time"
          name='startTime'
          rules={[
            { 
              required: true, 
              message: 'Please select a start time!' 
            }
          ]}
          hasFeedback
        >
          <DatePicker
              placeholder='Select start time'
              format="YYYY-MM-DD HH:mm"
              disabledDate={disabledDate}
              showTime={{
                defaultValue: dayjs('00:00', 'HH:mm'),
              }}
              onChange={(value) => { setStartTime(value) }}
          />
        </Form.Item>
        <Form.Item
          label="End Time"
          name='endTime'
          rules={[
            {
              required: true,
              message: 'Please select an end time!'
            },
            {
              validator: validateTimeDifference
            }
          ]}
          hasFeedback
        >
          <DatePicker
            placeholder='Select end time'
            format="YYYY-MM-DD HH:mm"
            disabledDate={disabledDate}
            showTime={{
              defaultValue: dayjs('00:00', 'HH:mm'),
            }}
            onChange={(value) => { setEndTime(value) }}
          />
        </Form.Item>
        <Form.Item
          label="Remind me"
          name='remind'
          valuePropName="checked"
        >
          <Checkbox onChange={handleRemind}></Checkbox>
        </Form.Item>
        <Form.Item
          wrapperCol={{
            ...addAppointmentFormLayout.wrapperCol,
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </div>
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default AddAppointment;