import React from 'react'
import styles from './Popup.module.scss'
import classNames from 'classnames/bind'
import gif_cat from '../../img/cat.gif'

const cx = classNames.bind(styles);

const Popup = () => {
    return (
        <div className={cx("wrapper")}>
            <h1 style={{textAlign: 'center'}}>Chúng tôi sẽ sớm hoàn thành tính năng này (◍•ᴗ•◍)♡ ✧*</h1>
            <img src={gif_cat} alt="Cat meowwing" width={80} />
        </div>
    )
}

export default Popup
