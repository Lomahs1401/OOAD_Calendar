import React, { useState } from 'react';
import styles from './Login.module.scss';
import classNames from 'classnames/bind';
import logo from '../../img/logo.png';
import facebookIcon from '../../img/facebook.png';
import googleIcon from '../../img/google.png';
import ImageSlider from '../../components/ImageSlider/ImageSlider';
import { Form, Button, Input, Divider, Modal, message } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import Popup from '../../components/Popup/Popup';
import { UserAuth } from '../../context/AuthContext';

const cx = classNames.bind(styles);

const Login = () => {

  const slides = [
    { url: 'http://localhost:3000/img/flower1.jpg', title: 'Flower 1' },
    { url: 'http://localhost:3000/img/flower2.jpg', title: 'Flower 2' },
    { url: 'http://localhost:3000/img/flower3.jpg', title: 'Flower 3' },
  ]

  const loginFormLayout = {
    labelCol: {
      span: 8
    },
    wrapperCol: {
      span: 24
    },
  };
  
  const {signIn} = UserAuth();
  const [form] = Form.useForm();

  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleLoginBySocial = (e) => {
    e.preventDefault();
    setIsModalOpen(true);
  }

  const handleOk = () => {
    setIsModalOpen(false);
  }

  const handleCancel = () => {
    setIsModalOpen(false);
  }

  const onFinish = async (values) => {
    const { email, password } = values;
    try {
      await signIn(email, password);
      message.success('Login successful!');
      navigate('/home');
    } catch(e) {
      console.log(e);
      message.error('Email or password is incorrect..');
    }
  };

  const onFinishFailed = () => {
    message.error('Login failed!');
  };

  return (
    <div className={cx("wrapper")}>
      <div className={cx("wrapper__left")}>
        <div className={cx("login-container")}>
          <div className={cx("login-container__logo")}>
            <img src={logo} alt='Logo' width={100} />
          </div>
          <div className={cx("login-container__main")}>
            <div>
              <h1 className={cx("title")}>Appointment Calendar App</h1>
              <p className={cx("title-description")}>Sign in to manage your appointments!</p>
            </div>
            <div>
              <Form
                {...loginFormLayout}
                form={form}
                layout='vertical'
                name='login_form'
                labelAlign='left'
                labelWrap='true'
                size='large'
                autoComplete="off"
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
              >
                <Form.Item
                  label="Email"
                  name="email"
                  rules={[
                    {
                      required: true,
                      message: 'Email is required!',
                    },
                    {
                      type: 'email',
                      message: 'Invalid email address!',
                    },
                  ]}
                  hasFeedback
                >
                  <Input
                    placeholder='john.doe@gmail.com'
                  />
                </Form.Item>
                <Form.Item
                  label="Password"
                  name="password"
                  rules={[
                    {
                      required: true,
                      message: 'Password is required!',
                    },
                  ]}
                  hasFeedback
                >
                  <Input.Password
                    placeholder='******'
                  />
                </Form.Item>
                <Form.Item wrapperCol={{ span: 24 }}>
                  <Button type="default" htmlType="submit" className={cx("button")}>
                    Login
                  </Button>
                </Form.Item>
              </Form>
            </div>
            <div className={cx("signup")}>
              <div className={cx("signup__title")}>Don't have an account yet?</div>
              <div>
                <Link to="/register" className={cx("signup__link")}>
                  Sign up here
                </Link>
              </div>
            </div>
            <Divider
              plain
              orientation='center'
              className={cx("seperate-line")}
            >
              Or login with
            </Divider>
            <div className={cx("social-media")}>
              <a href="/" className={cx("social-media__link")}>
                <Button
                  className={cx("social-media__button")}
                  onClick={(e) => handleLoginBySocial(e)}
                >
                  <img src={facebookIcon} className={cx("social-media__icon")} alt='facebook icon' />
                </Button>
              </a>
              <a href="/" className={cx("social-media__link")}>
                <Button
                  className={cx("social-media__button")}
                  onClick={(e) => handleLoginBySocial(e)}
                >
                  <img src={googleIcon} className={cx("social-media__icon")} alt='google icon' />
                </Button>
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className={cx("wrapper__right")}>
        <ImageSlider slides={slides} />
      </div>
      <Modal
        title="Tính năng đang phát triển"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <Button type="primary" key="back" onClick={handleOk}>OK</Button>,
        ]}
      >
        <Popup />
      </Modal>
    </div>
  )
}

export default Login