import React from 'react'
import styles from './Register.module.scss'
import classNames from 'classnames/bind'
import logo from '../../img/logo.png'
import ImageSlider from '../../components/ImageSlider/ImageSlider'
import { Form, Button, Input, message } from 'antd'
import { Link, useNavigate } from 'react-router-dom'
import { auth } from '../../firebase'
import { updateProfile } from 'firebase/auth'
import { UserAuth } from '../../context/AuthContext'

const cx = classNames.bind(styles);

const Register = () => {

  const slides = [
    { url: 'http://localhost:3000/img/sunset1.jpg', title: 'Sunset 1' },
    { url: 'http://localhost:3000/img/sunset2.jpg', title: 'Sunset 2' },
    { url: 'http://localhost:3000/img/sunset3.jpg', title: 'Sunset 3' },
  ]

  const registerFormLayout = {
    labelCol: {
      span: 8
    },
    wrapperCol: {
      span: 24
    },
  };

  const { createUser } = UserAuth();

  const [form] = Form.useForm();

  const navigate = useNavigate();

  const onFinish = async (values) => {
    const { email, password } = values;
    const username = form.getFieldValue('username');
    try {
      await createUser(email, password);
      const currentUser = auth.currentUser;
      updateProfile(currentUser, {displayName: username});
      message.success('Create account successed!');
      navigate('/');
    } catch (e) {
      console.log(e);
      message.error('Oops. Try again..');
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed: ', errorInfo);
    message.error('Create account failed!');
  };

  return (
    <div className={cx("wrapper")}>
      <div className={cx("wrapper__left")}>
        <ImageSlider slides={slides} />
      </div>
      <div className={cx("wrapper__right")}>
        <div className={cx("register-container")}>
          <div className={cx("register-container__logo")}>
            <img src={logo} alt='Logo' width={60} />
          </div>
          <div className={cx("register-container__main")}>
            <div>
              <h1 className={cx("title")}>Sign up</h1>
              <p className={cx("title-description")}>Let's sign up to build your wonderful day!</p>
            </div>
            <div>
              <Form
                {...registerFormLayout}
                form={form}
                layout='vertical'
                name='register_form'
                labelAlign='left'
                labelWrap='true'
                size='large'
                autoComplete="off"
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
              >
                <Form.Item
                  label="Username"
                  name="username"
                  rules={[
                    {
                      required: true,
                      message: 'Username is required!',
                    },
                  ]}
                  hasFeedback
                >
                  <Input
                    placeholder='John Doe'
                  />
                </Form.Item>
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
                <Form.Item
                  name="confirm"
                  label="Confirm Password"
                  dependencies={['password']}
                  hasFeedback
                  rules={[
                    {
                      required: true,
                      message: 'Please confirm your password!',
                    },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue('password') === value) {
                          return Promise.resolve();
                        }
                        return Promise.reject(new Error('The two passwords that you entered do not match!'));
                      },
                    }),
                  ]}
                >
                  <Input.Password 
                    placeholder='******'
                  />
                </Form.Item>
                <Form.Item wrapperCol={{ span: 24 }}>
                  <Button type="primary" htmlType="submit" className={cx("button")}>
                    Sign up
                  </Button>
                </Form.Item>
              </Form>
            </div>
            <div className={cx("login")}>
              <div className={cx("login__title")}>Already have an account yet?</div>
              <div>
                <Link to="/" className={cx("login__link")}>
                  Login here
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register