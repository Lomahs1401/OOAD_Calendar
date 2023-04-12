// import React from "react";
// import { useState } from "react";
// import Message from "./components/Message";
// import "./Popup.css";

// import {BsEnvelopeAtFill, BsBookmarkFill} from 'react-icons/bs'

// function Popup(props) {
//   const [checked, setChecked] = useState(false);
//   const [email, setEmail] = useState("");
//   const [date, setDate] = useState("");
//   const [meeting, setMeeting] = useState("");
//   const [meetingDescription, setMeetingDescription] = useState("");

//   const [emails, setEmails] = useState(() => {
//     const storageEmails = JSON.parse(localStorage.getItem("emails"));
//     return storageEmails || [];
//   });

//   const [meetings, setMeetings] = useState(() => {
//     const storageMeetings = JSON.parse(localStorage.getItem("meetings"));
//     return storageMeetings || [];
//   });

//   const [meetingDescriptions, setMeetingDescriptions] = useState(() => {
//     const storageMeetingDescriptions = JSON.parse(
//       localStorage.getItem("meetingDescriptions")
//     );
//     return storageMeetingDescriptions || [];
//   });

//   const [dates, setDates] = useState(() => {
//     const storageDates = JSON.parse(localStorage.getItem("Dates"));
//     return storageDates || [];
//   });

//   //
//   //
//   //--------------------handle meeting function--------------------
//   //
//   //

//   const handleMeeting = () => {
//     if (
//       meetings.find((temp) => meeting == temp) === undefined ||
//       dates.find((temp) => date == temp) === undefined
//     ) {
//       setMeetings((prev) => {
//         const newMeetings = [...prev, meeting];

//         const jsonMeetings = JSON.stringify(newMeetings);
//         localStorage.setItem("meetings", jsonMeetings);
//         return newMeetings;
//       });

//       setMeetingDescriptions((prev) => {
//         const newMeetingDescriptions = [...prev, meetingDescription];

//         const jsonMeetingDescriptions = JSON.stringify(newMeetingDescriptions);
//         localStorage.setItem("meetingDescriptions", jsonMeetingDescriptions);
//         return newMeetingDescriptions;
//       });

//       setDates((prev) => {
//         const newDates = [...prev, date];

//         const jsonDates = JSON.stringify(newDates);
//         localStorage.setItem("Dates", jsonDates);
//         return newDates;
//       });

//       setEmails((prev) => {
//         const tmpEmails = [email];
//         const newEmails = [...prev, tmpEmails];

//         const jsonEmails = JSON.stringify(newEmails);
//         localStorage.setItem("emails", jsonEmails);
//         return newEmails;
//       });

//     setMeeting("");
//     setDate("");
//     setMeetingDescription("");
//     setEmail("");

//     } else if (
//       meetings.find((temp) => meeting == temp) != undefined &&
//       dates.find((temp) => date == temp) != undefined
//     ) {
//       const index = meetings.indexOf(meeting);
//       const tmpEmailList = emails[index];
//       if (tmpEmailList.find((temp) => email == temp) === undefined) {
//         setChecked(true);
//       } else {
//         alert("Meeting already exists");
//         setMeeting("");
//         setDate("");
//         setMeetingDescription("");
//         setEmail("");
//       }
//     }


//     console.log(meetings);
//     console.log(meetingDescriptions);
//     console.log(dates);

//   };

//   return props.trigger ? (
//     <div className="Popup">
//       <div className="Popup_inner">
//         <div className="Header">
//           <h1>Make Apointment</h1>
//         </div>
//         <h3 className="Email_label">*Email</h3>
//         <BsEnvelopeAtFill className='Email_icon'/>
//         <input
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           className="Email"
//           placeholder="Enter email"
//         />
//         <h3 className="Date_label">*Date</h3>
//         <input
//           type="date"
//           value={date}
//           onChange={(e) => setDate(e.target.value)}
//           className="Date"
//         />
//         <h3 className="Name_label">*Name</h3>
//         <BsBookmarkFill className='Name_icon'/>
//         <input
//           value={meeting}
//           onChange={(e) => setMeeting(e.target.value)}
//           className="Name"
//           placeholder="Name of appointment"
//         />
//         <h3 className="Description_label">*Description</h3>
//         <textarea
//           rows="15"
//           cols="30"
//           value={meetingDescription}
//           onChange={(e) => setMeetingDescription(e.target.value)}
//           className="Description"
//           placeholder="Description"
//         />
//         <button className="add_button" onClick={handleMeeting}>
//           Create
//         </button>
//         <button
//           className="close_button"
//           onClick={() => props.setTrigger(false)}
//         >
//           Cancel
//         </button>
//       </div>
//       <Message
//         trigger={checked}
//         setTrigger={setChecked}
//         meetings={meetings}
//         meetingDescriptions={meetingDescriptions}
//         dates={dates}
//         emails={emails}
//         meeting={meeting}
//         date={date}
//         email={email}
//         meetingDescription={meetingDescription}
//         setEmail={setEmail}
//         setDate={setDate}
//         setMeeting={setMeeting}
//         setMeetingDescription={setMeetingDescription}
//       />
//     </div>
//   ) : (
//     ""
//   );
// }

// export default Popup;

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
