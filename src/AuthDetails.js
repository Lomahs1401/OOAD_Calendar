import React, { useEffect, useState } from 'react'
import { onAuthStateChange, signOut } from 'firebase/auth'
import { auth } from './firebase'

const AuthDetails = () => {

    const [authUser, setAuthUser] = useState(null);

    useEffect(() => {
        const listen = onAuthStateChange(auth, (user) => {
            if(user) {
                setAuthUser(user);
            } else {
                setAuthUser(null)
            }
        })
        return (() => {
            listen();
        })
    }, []);

    const userSignOut = () => {
        signOut(auth).then(() => {
            console.log('Logout successed');
        }).catch(error => console.log(error))
    }

  return (
    <div>AuthDetails</div>
  )
}

export default AuthDetails