import React, { useState, useRef } from 'react'
import { Modal, Button, Form, Input, TimePicker, message } from 'antd'
import Draggable from 'react-draggable';
import styles from './AddAppointment.module.scss'
import classNames from 'classnames/bind'
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2'
import { UserAuth } from '../../context/AuthContext';

const cx = classNames.bind(styles);

const AddAppointment = ({ date, openModal, setOpenModal }) => {

  const formLayout = {
    labelCol: {
      span: 8
    },
    wrapperCol: {
      span: 24
    },
  };

  const data = localStorage.getItem('data') ? JSON.parse(localStorage.getItem('data')) : []

  const navigate = useNavigate();

  // Handle click of modal 
  const handleOk = () => {
    setOpenModal(false);
  }

  const handleCancel = () => {
    setOpenModal(false);
  }

  const { user } = UserAuth();
  const [form] = Form.useForm();
  const draggleRef = useRef(null);

  // Set field for date input
  form.setFieldValue('date', date)
  form.setFieldValue('username', user.displayName)
  form.setFieldValue('email', user.email)

  console.log(user);

  // ---------------------------      Modal Draggable      ---------------------------
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

  const validateTimeDifference = (rule, value, callback) => {
    const { getFieldValue } = form;
    const startTime = getFieldValue('startTime');
    const endTime = getFieldValue('endTime');

    const startDate = new Date(0, 0, 0, startTime.hour(), startTime.minute());
    const endDate = new Date(0, 0, 0, endTime.hour(), endTime.minute());
    const diffInMs = endDate - startDate;
    const diffInMinutes = Math.floor((diffInMs / 1000) / 60);

    if (diffInMinutes < 1) {
      callback('Invalid duration');
    } else {
      callback();
    }
  };
  
  const times = data.map((item) => {
    const date = item.date
    const startTime = new Date(item.startTime)
    const endTime = new Date(item.endTime)
    return {
      date: date,
      startTime: startTime,
      endTime: endTime
    }
  })

  const [overlapIndex, setOverlapIndex] = useState(-1)

  // ---------------------------      Validate wheather appointment of time is overlaped      ---------------------------
  const checkTimeOverlap = (startTime, endTime) => {
    const startTmp = new Date(startTime)
    const endTmp = new Date(endTime)
    for (let i = 0; i < times.length; i++) {
      const element = times[i];
      if (startTmp < element.endTime && endTmp > element.startTime && date === element.date) {
        setOverlapIndex(i)
        return true;
      }
    }
    return false
  }
  
  // ---------------------------      Validate wheather appointment is duplicated      ---------------------------
  const validateDuplicateAppointment = () => {
    const appointmentName = form.getFieldValue('appointmentName')
    const date = form.getFieldValue('date')
    const startTime = new Date(form.getFieldValue('startTime'))
    const endTime = new Date(form.getFieldValue('endTime'))
    const data = localStorage.getItem('data') ? JSON.parse(localStorage.getItem('data')) : []

    startTime.setMilliseconds(0)
    endTime.setMilliseconds(0)
    
    for (let i = 0; i < data.length; i++) {
      const element = data[i];
      const elementStartTime = new Date(element.startTime)
      elementStartTime.setMilliseconds(0)
      const elementEndTime = new Date(element.endTime)
      elementEndTime.setMilliseconds(0)
      if (
        element.appointmentName === appointmentName && 
        element.date === date && 
        elementStartTime.getTime() === startTime.getTime() && 
        elementEndTime.getTime() === endTime.getTime()
      ) {
        return i
      }
    }
    return -1
  }

  // ---------------------------      Handle submit Form      ---------------------------
  // Failed case
  const onFinishFailed = (values) => {
    console.log('Error', values)
    message.error('Add appointment failed!');
  }

  // Success case
  const onFinish = (values) => {
    console.log(values);
    const dupplicateIndex = validateDuplicateAppointment()
    if (dupplicateIndex !== -1) {
      Swal.fire({
        title: 'Appointment exist!',
        text: "The appointment you entered has been alrealdy exist! Do you want to join the group meeting instead?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Join'
      }).then((result) => {
        if (result.isConfirmed) {
          let newData = [...data]
          if (!newData[dupplicateIndex].usernames.includes(localStorage.getItem('username'))) {
            newData[dupplicateIndex].usernames = [...newData[dupplicateIndex].usernames, localStorage.getItem('username')]
            localStorage.setItem('data', JSON.stringify(newData))
          }
          Swal.fire(
            'Hurray!',
            'You has been added to the group meeting!',
            'success'
          ).then(() => {
            navigate(0)
          })
        }
      })
    }
    else if (checkTimeOverlap(values.startTime, values.endTime)) {
      Swal.fire({
        title: 'Time overlapping?',
        text: "Your already has an appointment at that time! Do you want to replace it?",
        icon: 'warning',
        showCancelButton: true,
        cancelButtonText: 'Choose another time',
        confirmButtonText: 'Replace'
      }).then((result) => {
        if (result.isConfirmed) {
          let newData = [...data]
          newData.splice(overlapIndex, 1, values)
          localStorage.setItem('data', JSON.stringify(newData))
          Swal.fire(
            'Replaced!',
            'Your appointment has been replaced.',
            'success'
          ).then(() => {
            navigate(0)
          })
        }
      })
    }
    else {
      let data = localStorage.getItem('data') ? JSON.parse(localStorage.getItem('data')) : []
      const newData = [...data, values];
      localStorage.setItem('data', JSON.stringify(newData))
      setOpenModal(false);
      Swal.fire(
        'Created!',
        'Your appointment has been created.',
        'success'
      ).then(() => {
        navigate(0)
      })
    }
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
        {...formLayout}
        form={form}
        layout='vertical'
        name='appointment_form'
        labelAlign='left'
        labelWrap='true'
        size='middle'
        autoComplete="off"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        className={cx("modal-form")}
        initialValues={{
          date: date,
          username: user.displayName,
          email: user.email,
        }}
      >
        <Form.Item
          name='date'
          label="Date"
          rules={[
            {
              required: true, 
            },
          ]}
          hasFeedback
        >
          <Input
            defaultValue={date}
            initialValues={date}
            disabled
          />
        </Form.Item>
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
          rules={[{
            required: true,
            message: 'Please select a start time'
          }]}
          hasFeedback
        >
          <TimePicker format="HH:mm" />
        </Form.Item>
        <Form.Item
          label="End Time"
          name='endTime'
          rules={[
            {
              required: true,
              message: 'Please select an end time'
            },
            {
              validator: validateTimeDifference
            }
          ]}
          hasFeedback
        >
          <TimePicker format="HH:mm" />
        </Form.Item>
        <Form.Item
          wrapperCol={{
            ...formLayout.wrapperCol,
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