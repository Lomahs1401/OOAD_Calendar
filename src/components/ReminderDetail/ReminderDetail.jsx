import React, { useRef, useState } from 'react'
import Draggable from 'react-draggable';
import './ReminderDetail.module.scss'
import { Modal, Descriptions, Divider } from 'antd'
import { UserAuth } from '../../context/AuthContext'

function ReminderDetail({ data, openModal, setOpenModal }) {
  const {user} = UserAuth();
  // Handle click of modal
  const handleOk = (e) => {
    setOpenModal(false);
  };
  const handleCancel = (e) => {
    setOpenModal(false);
  };

  const draggleRef = useRef(null);

  const startTime = new Date(data.startTime)
  const endTime = new Date(data.endTime)

  const startTimeStr = startTime.toLocaleTimeString([], { hour: 'numeric', minute: 'numeric' })
  const endTimeStr = endTime.toLocaleTimeString([], { hour: 'numeric', minute: 'numeric' })

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

  return (
    <Modal
      title={
        <div
          style={{
            width: '100%',
            cursor: 'move',
          }}
          onMouseOver={() => {
            if (disabled) {
              setDisabled(false);
            }
          }}
          onMouseOut={() => {
            setDisabled(true);
          }}
        >
          Appointment Details
        </div>
      }
      open={openModal}
      onOk={handleOk}
      onCancel={handleCancel}
      modalRender={(modal) => (
        <Draggable
          disabled={disabled}
          bounds={bounds}
          onStart={(event, uiData) => onStart(event, uiData)}
        >
          <div ref={draggleRef}>{modal}</div>
        </Draggable>
      )}
      footer={null}
    >
      <Descriptions>
        <Descriptions.Item label="Name">{data.title}</Descriptions.Item>
        <Descriptions.Item label="Date">{data.date}</Descriptions.Item>
        <Descriptions.Item label="Location">{data.location}</Descriptions.Item>
        <Divider/>
        <Descriptions.Item label="Email">{user.email}</Descriptions.Item>
        <Descriptions.Item label="Start Time">{startTimeStr}</Descriptions.Item>
        <Descriptions.Item label="End Time">{endTimeStr}</Descriptions.Item>
        <Descriptions.Item label="Users">{user.displayName}</Descriptions.Item>
      </Descriptions>
    </Modal>
  )
}

export default ReminderDetail